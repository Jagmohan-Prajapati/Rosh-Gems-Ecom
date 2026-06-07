import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { createServer as createViteServer } from "vite";
import { getPrisma } from "./src/lib/prisma.ts";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cookieParser());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const razorpay =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "change-this-secret"
);

interface AuthUser extends JWTPayload {
  id: string;
  email: string;
  role: string;
}

interface AuthRequest extends Request {
  user: AuthUser;
}

const upload = multer({ dest: "uploads/" });

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(
  email: string,
  otp: string,
  type: "verify" | "reset"
) {
  const subject =
    type === "verify"
      ? "Verify your RoshGems account"
      : "Reset your RoshGems password";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h1 style="margin: 0 0 8px;">RoshGems</h1>
      <p style="margin: 0 0 24px; color: #666;">Luxury Gemstones • India</p>
      <h2 style="margin: 0 0 12px;">${
        type === "verify" ? "Verify Your Email" : "Reset Your Password"
      }</h2>
      <p style="margin: 0 0 16px;">Use this OTP code. It expires in <strong>10 minutes</strong>.</p>
      <div style="font-size: 32px; font-weight: 700; letter-spacing: 6px; margin: 20px 0;">${otp}</div>
      <p style="margin-top: 24px; color: #666;">If you did not request this, you can ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"RoshGems" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html,
  });
}

async function isAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    (req as AuthRequest).user = payload as AuthUser;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

async function isAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }
    (req as AuthRequest).user = payload as AuthUser;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

/* ----------------------------- AUTH ROUTES ----------------------------- */

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const prisma = getPrisma();

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (email === process.env.ADMIN_EMAIL) {
      const adminValid = await bcrypt.compare(
        password,
        process.env.ADMIN_PASSWORD_HASH || ""
      );

      if (adminValid) {
        const token = await new SignJWT({
          id: "admin",
          email,
          role: "ADMIN",
        })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("7d")
          .sign(JWT_SECRET);

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
          id: "admin",
          name: "Admin",
          email,
          role: "ADMIN",
          isVerified: true,
        });
      }
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

app.post("/api/auth/register", async (req, res) => {
  return res
    .status(400)
    .json({ error: "Please use the OTP verification flow to register." });
});

app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const prisma = getPrisma();

    if (!email) return res.status(400).json({ error: "Email is required" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.create({
      data: {
        email,
        code: otp,
        type: "VERIFY_EMAIL",
        expiresAt,
      },
    });

    await sendOtpEmail(email, otp, "verify");
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { name, email, password, phone, otp } = req.body;
    const prisma = getPrisma();

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const record = await prisma.otpCode.findFirst({
      where: {
        email,
        code: otp,
        type: "VERIFY_EMAIL",
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await prisma.otpCode.update({
      where: { id: record.id },
      data: { used: true },
    });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone: phone || "",
        role: "USER",
        isVerified: true,
      },
    });

    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const prisma = getPrisma();

    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ success: true });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.create({
      data: {
        email,
        code: otp,
        type: "RESET_PASSWORD",
        expiresAt,
      },
    });

    await sendOtpEmail(email, otp, "reset");
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to send reset OTP" });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const prisma = getPrisma();

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const record = await prisma.otpCode.findFirst({
      where: {
        email,
        code: otp,
        type: "RESET_PASSWORD",
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await prisma.otpCode.update({
      where: { id: record.id },
      data: { used: true },
    });

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Password reset failed" });
  }
});

app.get("/api/auth/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.role === "ADMIN") {
      return res.json({
        id: "admin",
        name: "Admin",
        email: payload.email,
        role: "ADMIN",
        isVerified: true,
      });
    }

    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(401).json({ error: "Unauthorized" });
    res.json(user);
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

/* ----------------------------- USER ROUTES ----------------------------- */

app.get("/api/user/profile", isAuth, async (req: Request, res: Response) => {
  const prisma = getPrisma();
  const authReq = req as AuthRequest;

  try {
    const user = await prisma.user.findUnique({
      where: { id: authReq.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.patch("/api/user/profile", isAuth, async (req: Request, res: Response) => {
  const prisma = getPrisma();
  const authReq = req as AuthRequest;

  try {
    const { name, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: authReq.user.id },
      data: { name, phone },
      select: { id: true, name: true, email: true, phone: true },
    });

    res.json(user);
  } catch {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.patch(
  "/api/user/change-password",
  isAuth,
  async (req: Request, res: Response) => {
    const prisma = getPrisma();
    const authReq = req as AuthRequest;

    try {
      const { currentPassword, newPassword } = req.body;
      const user = await prisma.user.findUnique({
        where: { id: authReq.user.id },
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: authReq.user.id },
        data: { passwordHash },
      });

      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to change password" });
    }
  }
);

app.get("/api/user/addresses", isAuth, async (req: Request, res: Response) => {
  const prisma = getPrisma();
  const authReq = req as AuthRequest;

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: authReq.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    res.json(addresses);
  } catch {
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

app.post("/api/user/addresses", isAuth, async (req: Request, res: Response) => {
  const prisma = getPrisma();
  const authReq = req as AuthRequest;

  try {
    const {
      label,
      name,
      phone,
      line1,
      line2,
      city,
      state,
      zip,
      country,
      isDefault,
    } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: authReq.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: authReq.user.id,
        label,
        name,
        phone,
        line1,
        line2,
        city,
        state,
        zip,
        country: country || "India",
        isDefault: isDefault || false,
      },
    });

    res.json(address);
  } catch {
    res.status(500).json({ error: "Failed to add address" });
  }
});

app.patch("/api/user/addresses/:id", isAuth, async (req, res) => {
  const prisma = getPrisma();
  const authReq = req as AuthRequest;

  try {
    const existing = await prisma.address.findUnique({
      where: { id: req.params.id },
    });

    if (!existing || existing.userId !== authReq.user.id) {
      return res.status(404).json({ error: "Address not found" });
    }

    const {
      label,
      name,
      phone,
      line1,
      line2,
      city,
      state,
      zip,
      country,
      isDefault,
    } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: authReq.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id: req.params.id },
      data: {
        label,
        name,
        phone,
        line1,
        line2,
        city,
        state,
        zip,
        country,
        isDefault,
      },
    });

    res.json(address);
  } catch {
    res.status(500).json({ error: "Failed to update address" });
  }
});

app.delete("/api/user/addresses/:id", isAuth, async (req, res) => {
  const prisma = getPrisma();
  const authReq = req as AuthRequest;

  try {
    const existing = await prisma.address.findUnique({
      where: { id: req.params.id },
    });

    if (!existing || existing.userId !== authReq.user.id) {
      return res.status(404).json({ error: "Address not found" });
    }

    await prisma.address.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete address" });
  }
});

/* --------------------------- PRODUCT ROUTES ---------------------------- */

app.get("/api/products", async (req, res) => {
  const { category, stoneType, stoneColor, search, sort, featured } = req.query;
  const prisma = getPrisma();

  const where: any = { isActive: true };

  if (category) where.category = category;
  if (stoneType) where.stoneType = stoneType;
  if (stoneColor) where.stoneColor = stoneColor;
  if (featured === "true") where.isFeatured = true;

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: "insensitive" } },
      { description: { contains: search as string, mode: "insensitive" } },
      { stoneType: { contains: search as string, mode: "insensitive" } },
      { stoneColor: { contains: search as string, mode: "insensitive" } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };

  try {
    const products = await prisma.product.findMany({ where, orderBy });
    res.json(products);
  } catch {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  const prisma = getPrisma();

  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

app.post("/api/products", isAdmin, async (req, res) => {
  const prisma = getPrisma();

  try {
    const product = await prisma.product.create({
      data: req.body,
    });

    res.json(product);
  } catch {
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.patch("/api/products/:id", isAdmin, async (req, res) => {
  const prisma = getPrisma();

  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(product);
  } catch {
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/api/products/:id", isAdmin, async (req, res) => {
  const prisma = getPrisma();

  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      select: { id: true, images: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (Array.isArray(product.images) && product.images.length > 0) {
      await Promise.all(
        product.images.map(async (imageUrl: string) => {
          try {
            const match = imageUrl.match(
              /\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|webp|avif)$/i
            );
            if (!match) return null;
            const publicId = match[1];
            return cloudinary.uploader.destroy(publicId);
          } catch {
            return null;
          }
        })
      );
    }

    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.post("/api/upload", isAdmin, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "roshgems",
    });

    res.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch {
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ---------------------------- ORDER ROUTES ----------------------------- */

app.post("/api/orders/create", isAuth, async (req, res) => {
  const prisma = getPrisma();
  const authReq = req as AuthRequest;

  try {
    const { items, shippingAddress, total } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items are required" });
    }

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || product.stockQty < item.quantity) {
        return res.status(400).json({
          error: `Not enough stock for ${product?.name || "product"}`,
        });
      }
    }

    const dbOrder = await prisma.order.create({
      data: {
        userId: authReq.user.id,
        total,
        currency: "INR",
        shippingAddress,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQty: { decrement: item.quantity },
        },
      });
    }

    if (!razorpay) {
      return res.status(500).json({
        error: "Razorpay is not configured on the server",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: dbOrder.id,
    });

    await prisma.order.update({
      where: { id: dbOrder.id },
      data: {
        razorpayOrderId: razorpayOrder.id,
      },
    });

    res.json({
      orderId: dbOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: total,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch {
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.post("/api/orders/verify", isAuth, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const prisma = getPrisma();

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        status: "PROCESSING",
        razorpayPaymentId,
        razorpaySignature,
        paidAt: new Date(),
        currency: "INR",
      },
    });

    res.json({ success: true, orderId: order.id });
  } catch {
    res.status(500).json({ error: "Payment verification failed" });
  }
});

app.get("/api/orders/my", isAuth, async (req, res) => {
  const prisma = getPrisma();
  const authReq = req as AuthRequest;

  try {
    const orders = await prisma.order.findMany({
      where: { userId: authReq.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
      },
    });

    res.json(orders);
  } catch {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/api/orders/:id", isAuth, async (req, res) => {
  const prisma = getPrisma();
  const authReq = req as AuthRequest;

  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.userId !== authReq.user.id && authReq.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(order);
  } catch {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

app.get("/api/orders", isAdmin, async (req, res) => {
  const prisma = getPrisma();

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch {
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
});

app.patch("/api/orders/:id/status", isAdmin, async (req, res) => {
  const prisma = getPrisma();

  try {
    const { status, trackingId, trackingUrl } = req.body;

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status, trackingId, trackingUrl },
    });

    res.json(order);
  } catch {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

/* ---------------------------- FRONTEND SERVE --------------------------- */

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("/*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
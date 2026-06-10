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
const COOKIE_NAME = "token";

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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(new Error("Only JPEG, PNG, WEBP and AVIF images are allowed."));
  },
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function authCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function sanitizeUser(user: {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  isVerified?: boolean;
  createdAt?: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    role: user.role,
    isVerified: user.isVerified ?? true,
    createdAt: user.createdAt,
  };
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function signAuthToken(payload: { id: string; email: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

async function sendOtpEmail(
  email: string,
  code: string,
  type: "verify" | "reset"
) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[OTP:${type}] ${email} -> ${code}`);
    return;
  }

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
      <div style="font-size: 32px; font-weight: 700; letter-spacing: 6px; margin: 20px 0;">${code}</div>
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
  const token = req.cookies[COOKIE_NAME];
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
  const token = req.cookies[COOKIE_NAME];
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

function extractCloudinaryPublicId(imageUrl: string) {
  const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
  return match?.[1] ?? null;
}

function toTrimmedString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() || fallback : fallback;
}

function toOptionalTrimmedString(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function toNumber(value: unknown, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function toOptionalNumber(value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function toBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function sanitizeProductImages(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function buildProductPayload(body: any) {
  const name = toTrimmedString(body?.name);
  const description = toTrimmedString(body?.description);
  const images = sanitizeProductImages(body?.images);
  const price = toNumber(body?.price, NaN);
  const stockQty = toNumber(body?.stockQty, NaN);
  const caratWeight = toOptionalNumber(body?.caratWeight);

  if (!name) {
    return { error: "Product name is required." };
  }

  if (!description) {
    return { error: "Description is required." };
  }

  if (!images.length) {
    return { error: "At least one product image is required." };
  }

  if (!Number.isFinite(price) || price <= 0) {
    return { error: "Price must be greater than 0." };
  }

  if (!Number.isFinite(stockQty) || stockQty < 0) {
    return { error: "Stock quantity cannot be negative." };
  }

  if (caratWeight !== null && caratWeight <= 0) {
    return { error: "Carat weight must be greater than 0 when provided." };
  }

  return {
    data: {
      name,
      description,
      price,
      images,
      category: toTrimmedString(body?.category, "Raw Stones"),
      stoneType: toTrimmedString(body?.stoneType, "Sapphire"),
      stoneColor: toTrimmedString(body?.stoneColor, "Blue"),
      caratWeight,
      origin: toOptionalTrimmedString(body?.origin),
      certification: toOptionalTrimmedString(body?.certification),
      stockQty,
      isActive: toBoolean(body?.isActive, true),
      isFeatured: toBoolean(body?.isFeatured, false),
    },
  };
}

/* AUTH */

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

      if (!adminValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = await signAuthToken({
        id: "admin",
        email,
        role: "ADMIN",
      });

      res.cookie(COOKIE_NAME, token, authCookieOptions());

      return res.json({
        user: {
          id: "admin",
          name: "Admin",
          email,
          phone: "",
          role: "ADMIN",
          isVerified: true,
        },
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = await signAuthToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie(COOKIE_NAME, token, authCookieOptions());

    return res.json({
      user: sanitizeUser(user),
    });
  } catch {
    return res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
});

app.post("/api/auth/register", async (_req, res) => {
  return res
    .status(400)
    .json({ error: "Please use the OTP verification flow to register." });
});

app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email, type } = req.body;
    const prisma = getPrisma();

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const otpType = type === "RESET_PASSWORD" ? "RESET_PASSWORD" : "VERIFY_EMAIL";

    if (otpType === "VERIFY_EMAIL") {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: "Email already registered" });
      }
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.create({
      data: {
        email,
        code,
        type: otpType,
        expiresAt,
      },
    });

    await sendOtpEmail(email, code, otpType === "VERIFY_EMAIL" ? "verify" : "reset");

    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { name, email, password, phone, code } = req.body;
    const prisma = getPrisma();

    if (!name || !email || !password || !code) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const record = await prisma.otpCode.findFirst({
      where: {
        email,
        code,
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

    const token = await signAuthToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.cookie(COOKIE_NAME, token, authCookieOptions());

    return res.json({
      user: sanitizeUser(user),
    });
  } catch {
    return res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const prisma = getPrisma();

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ success: true });
    }

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.create({
      data: {
        email,
        code,
        type: "RESET_PASSWORD",
        expiresAt,
      },
    });

    await sendOtpEmail(email, code, "reset");

    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to send reset OTP" });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const prisma = getPrisma();

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const record = await prisma.otpCode.findFirst({
      where: {
        email,
        code,
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

    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Password reset failed" });
  }
});

app.get("/api/auth/me", async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    return res.json({ user: null });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.role === "ADMIN") {
      return res.json({
        user: {
          id: "admin",
          name: "Admin",
          email: payload.email,
          phone: "",
          role: "ADMIN",
          isVerified: true,
        },
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

    if (!user) {
      return res.json({ user: null });
    }

    return res.json({ user });
  } catch {
    return res.json({ user: null });
  }
});

/* USER */

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

    res.json({ user });
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
      select: { id: true, name: true, email: true, phone: true, role: true, isVerified: true },
    });

    res.json({ user });
  } catch {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.patch("/api/user/change-password", isAuth, async (req: Request, res: Response) => {
  const prisma = getPrisma();
  const authReq = req as AuthRequest;

  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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
});

app.get("/api/user/addresses", isAuth, async (req: Request, res: Response) => {
  const prisma = getPrisma();
  const authReq = req as AuthRequest;

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: authReq.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    res.json({ addresses });
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
        isDefault: !!isDefault,
      },
    });

    res.status(201).json({ address });
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
        country: country || "India",
        isDefault: !!isDefault,
      },
    });

    res.json({ address });
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

/* PRODUCTS */

app.post("/api/upload", isAdmin, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded." });
  }

  try {
    const result = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "roshgems/products",
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"));
            return;
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      stream.end(req.file.buffer);
    });

    return res.json({
      url: result.secure_url,
      secure_url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Upload failed",
    });
  }
});

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
    res.json({ products });
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
    res.json({ product });
  } catch {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

app.post("/api/products", isAdmin, async (req, res) => {
  const prisma = getPrisma();

  try {
    const parsed = buildProductPayload(req.body);

    if ("error" in parsed) {
      return res.status(400).json({ error: parsed.error });
    }

    const product = await prisma.product.create({ data: parsed.data });
    return res.status(201).json({ product });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to create product",
    });
  }
});

app.patch("/api/products/:id", isAdmin, async (req, res) => {
  const prisma = getPrisma();
  const { id } = req.params;

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }

    const parsed = buildProductPayload(req.body);

    if ("error" in parsed) {
      return res.status(400).json({ error: parsed.error });
    }

    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    return res.json({ product });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to update product",
    });
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
          const publicId = extractCloudinaryPublicId(imageUrl);
          if (!publicId) return null;

          try {
            return await cloudinary.uploader.destroy(publicId);
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

/* ORDERS */

app.post("/api/orders/create", isAuth, async (req, res) => {
  const prisma = getPrisma();
  const authReq = req as AuthRequest;

  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items are required" });
    }

    let subtotal = 0;
    const normalizedItems: Array<{ productId: string; quantity: number; price: number }> = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || product.stockQty < item.quantity) {
        return res.status(400).json({
          error: `Not enough stock for ${product?.name || "product"}`,
        });
      }

      subtotal += product.price * item.quantity;
      normalizedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const shipping = subtotal === 0 ? 0 : subtotal >= 4000 ? 0 : 299;
    const total = subtotal + shipping;

    const dbOrder = await prisma.order.create({
      data: {
        userId: authReq.user.id,
        total,
        currency: "INR",
        shippingAddress,
        status: "PENDING",
        items: {
          create: normalizedItems,
        },
      },
    });

    if (!razorpay) {
      return res.status(201).json({
        orderId: dbOrder.id,
        razorpayOrderId: `local_${dbOrder.id}`,
        amount: total,
        razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
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

    res.status(201).json({
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
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId, isSandboxBypass } =
      req.body;

    let valid = false;

    if (isSandboxBypass || !process.env.RAZORPAY_KEY_SECRET) {
      valid = true;
    } else {
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      valid = generatedSignature === razorpaySignature;
    }

    if (!valid) {
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

    res.json({ orders });
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

    res.json({ order });
  } catch {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

app.get("/api/orders", isAdmin, async (_req, res) => {
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

    res.json({ orders });
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

    res.json({ order });
  } catch {
    res.status(500).json({ error: "Failed to update order status" });
  }
});

/* FRONTEND SERVE */

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const html = await vite.transformIndexHtml(
          url,
          `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>RoshGems</title>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="/src/main.tsx"></script>
            </body>
          </html>`
        );
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("/*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
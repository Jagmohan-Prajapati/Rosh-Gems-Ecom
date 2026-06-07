/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "../types";

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "gem-emerald-1",
    name: "Veridian Heirloom",
    refCode: "RG-2024-001",
    category: "COLLECTIONS",
    stoneType: "EMERALD",
    stoneColor: "Deep Green",
    price: 4200,
    description: "An evocative Colombian emerald featuring crystal-clear facets of intense forest hues, set in hand-drawn settings.",
    story: "A deep, mesmerizing teal that captures the shifting light of a tropical forest at twilight, set in our signature hand-carved rose gold facet.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdxLOp7YYH--7HraJPEGWnnobgM9CU4CckIPS9tdpv8W80yA4P7Eio5HBlO2ZkBJuWLEGdKD0WMduCXWbo1E0oLfXkdLEOVf5LLHZD7iIjbi-vGO0GSrxZQuyJ64bVbvleOS6Hp0n1mh4i5EON9MTIhQ58w5HtvyDCJ1ohKDjSEky2nioWCUriAi1mZDtC8wGbTnUm8qnLaesJm4IBPzomEKBQKDLVUC5-S9JCfNTr9xzdA1JCyy2T2PSEXTgI2hPoio3qVVn3zGEC"
    ],
    stockQty: 5,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "gem-sapphire-2",
    name: "Midnight Azure",
    refCode: "RG-2024-002",
    category: "COLLECTIONS",
    stoneType: "SAPPHIRE",
    stoneColor: "Kashmir Blue",
    price: 3850,
    description: "A breathtaking cushion-cut authentic Kashmir blue sapphire, catching natural light in shimmering azure dimensions.",
    story: "Drawn from historic lineages, this natural sapphire carries inside its crystal structures the deep starry patterns of mountain midnights.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBTi4wsllUPy1mc7bB5zcQ-wTKJ4h7gz_CAADF_f1-rueqcQ2tMbSs0Q7U4En22ZqzKpVsxykkk1FjntE92rmWQ3FXNbIrdy7Js55WNINpAebVaZUEmk8s3sGbpBZ3AIxXPRzbu_NmKpW4_bJ9I0pnjjflJOBud3UbGdPKAOgvrzOZevkVrKquLrBTR8RCrDaYWSiKFyKI4lpJp6wEmc0md5Ba1xlbfgv3LsicbqQZfW0rT3FZBUUvP3GLd4P5Sq5vhmQBFOISGT5LN"
    ],
    stockQty: 3,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "gem-amethyst-3",
    name: "Velvet Bloom",
    refCode: "RG-2024-003",
    category: "COLLECTIONS",
    stoneType: "AMETHYST",
    stoneColor: "Imperial Violet",
    price: 1200,
    description: "Heart-cut intense violet amethyst set in high-purity recycled gold, providing stunning modern luxury and eye-safe color depth.",
    story: "Hand-finished by our head curators, its crystalline structures possess distinct purple refractions that pair elegantly with soft textures.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDyi3asSAPZFvMfjOCtC5g53m_sfpm9Qx3jEdO_0JSsVanZd4zPZyQl81PQPFZHjFo4uK4VIppJphu4IDK8fQ8tT2PjLhumbs12kGn9WbBjoqxJ5fUfA9iRnSkjML_ZMo08P08wdNaPv2_CmRWRTtH5pgCT2O8j9VcDiT0HmKdalpHtpAYd6jz2KmtNmI2Fmydh12Xz7pv9jj1XrntP-6qzLAbah0gDhR_IijOtntp1WeWLJlzf27iYlWfTIlEyvo7MzdYLvvDIFnrc"
    ],
    stockQty: 8,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "gem-diamond-4",
    name: "Rose Petal Radiant",
    refCode: "RG-2024-004",
    category: "HERITAGE",
    stoneType: "DIAMOND",
    stoneColor: "Sunset Pink",
    price: 12400,
    description: "An exceptionally rare, natural pink diamond with an exquisite brilliant-cut. Catching golden sunbeams on any polished surface.",
    story: "Historically mined and certified with pristine clarity, its pink hues represent the standard of timeless romantic keepsakes.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASiDurkYFbrKoOKV2uUEmC1AxGwzNj0QZAiys9P0Qi4jk-PnYMZRT2d1BjD6rp2kZbXPwSc6gvhPa5yqc_jwkQ7A4MeYqtKfpN763eLITwZghzURtGneLgZpIFJLyhxHu7uPip_AUk5C2En5fyRbfAYHBxL30sXjqL-wCy1ZcmWpLhiLzMD_DiFYaVLEuWnPvlaKuAm6sZvWb_YnjGwjw7Jxjlenh7-TLrDcLhfeWc9y35BPtcnu8171FjxHUsoJNZIbwgSApBclUg"
    ],
    stockQty: 2,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "gem-pearl-5",
    name: "Ocean's Whisper",
    refCode: "RG-2024-005",
    category: "COLLECTIONS",
    stoneType: "MORGANITE",
    stoneColor: "Iridescent Pearl",
    price: 900,
    description: "Highly lustrous, perfect round wild ocean pearl showcasing colorful iridescence on a fine bed of raw white silk.",
    story: "Each pearl is ethically harvested from secluded coves under state supervision and matched for flawless visual consistency.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWArz3TXY4v3SAAqKCbPl-ZFG12H0wBn7yIQg53bsB25wx91K1HDoknwUIq_KE8r0H1HjHoDAQiGv-rXotSD3yxpm3c2EzcDhhXHeUCVJhqY4Xd2i1VWrFAYZNmLTQGcM82zQD5_6XfIinv0qb0RlICr0_2vUQGM6Rh_f0kgZFBEvebt2krvsCxESjh7Eyozev20r_FOocC3fbuQMB1S2LFEU3OJond-NoeKnbE9W2HznGqUvZhLCuXYc5YT9ysu7yCwcnoIY_OZhk"
    ],
    stockQty: 10,
    isFeatured: false,
    isActive: true,
  },
  {
    id: "gem-ruby-6",
    name: "Crimson Legacy",
    refCode: "RG-2024-006",
    category: "HERITAGE",
    stoneType: "RUBY",
    stoneColor: "Pigeon Blood Red",
    price: 5600,
    description: "Pigeon's blood red brilliant cushion-cut Burmese ruby resting inside a dark velvet box. Unbelievable saturation.",
    story: "Sourced under fair-labor certifications, its crimson intensity serves as a glowing fireplace in the eyes of any beholder.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtSb_TIB6LpIxKvrzH3NO2f2mTsmHwIO5teeL-EwxZoMSVCthUysW_am_Bhk_Qlkpvipn_ujbopyF8H9c3yaSBOVGVMk3lq7-8GmISbmqpEemRHU4_fvdjFpfwp2N-h7UKC8V4VCZY3_ag6sBhtNTygOFvE-Uhs5Ze3kxSGwQlogsl5w_T08racSyAi2FJnW4HssSbdgMWQcfSXHKMxNZ-NZujiD7vAms8lzis3A1TZaPuNgsV1Jkuw9jRsjHDWq5LpnGrNqudrxHs"
    ],
    stockQty: 4,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "gem-aquamarine-7",
    name: "Celestial Mist",
    refCode: "RG-2024-007",
    category: "BESPOKE",
    stoneType: "AQUAMARINE",
    stoneColor: "Ice Blue",
    price: 2100,
    description: "A crystal clear pale ice blue teardrop aquamarine gemstone, set in a highly polished 18k rose gold mount.",
    story: "Bringing forth the absolute purity of pristine Arctic waters, its sparkling elements carry healing tones of peace.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkMhrgOy4DxlJOaE1jpYA1fwiOSk2mLFgToitzB69wRF6xCg0wnv8-WRxu1VCOOHtJc6TesdeIOEdQNwwaMqp3bK9H9Zw3gJsgDZdn0rMt-swRqb0oc9Q5qIFmpMYJK5NhNWnfn6pAOx9DdlInrmeFQ9oaF95hgxfpex8PSjgoYuLx7Nbq4HPR_cNofrYPBEzZNkkSLeqbYE_CXXbz7QHV2ZV9Cp9OGt2NEwqvvBOXKwFkFMCMTijIMsaiLsh8VSq9qz2U-Zat5yMb"
    ],
    stockQty: 6,
    isFeatured: false,
    isActive: true,
  },
  {
    id: "gem-topaz-8",
    name: "Golden Solstice",
    refCode: "RG-2024-008",
    category: "COLLECTIONS",
    stoneType: "TOPAZ",
    stoneColor: "Solstice Gold",
    price: 1800,
    description: "An incredibly faceted yellow imperial topaz reflecting golden warm rays, mimicking the high sun of the summer solstice.",
    story: "Sourced from historic Brazilian deposits, its facets generate magnificent, fire-like performance under candle lighting.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAj_M_7OEsvbxMETv8D1PNN7rMGQ5a8sARnzJMqLS9_Dv9K_tYrjWQWwFosmTXgHznbqoGq539FXtoM7PgJ84foejU3jWcTSLw4NPQAPnzWaeqCIlJ95oqxi1-03SXuKe7ve1dFx_NCR73e975IVWFxoJzxkcUpztbHaT2E1cWgtq2L0hHt_qCrYwliQ0vq4CsZGJwGPBXewdoiruk6Fs8Pm9Kj8GswO1t2nzRhQaSPpf70K0iyMLhlSO04hlcVeeO9YrziTrJQrnVk"
    ],
    stockQty: 7,
    isFeatured: true,
    isActive: true,
  }
];
export const SAMPLE_BLOGS = [
  {
    id: "blog-1",
    title: "Behind the Bench: The Art of the Facet",
    summary: "Discover how our master cutters bring fire and light to raw stones through centuries-old techniques perfected in our London atelier.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfFIXj8brOspMrfKSC-PYwFzlTumZrh5jI_mLsQMPTf0xu3WYwnP37FU9tjnFV2UAWKSrBpXOaA2z5q-d-d8hJs6koeVA2_4dnSjSRQ5rkOlujhELEGjQ1F6b0dU2kyXM-ZAqBNbnd1AGv7or7MRV1E0RXJytTs1GfvmCjI5pm55hCfMIe8TqqrJxyzoM_X9p8nB_g12rLwYFdhbaSrzcSpm9gfSnM9cvKnVwnoLYsgmi68Z-uPIayPXKSh-Uiz7cSP3OyHt751GAJ"
  },
  {
    id: "blog-2",
    title: "Traceable Beauty: Our Ethics Roadmap",
    summary: "From the mine to the jewel box, learn about our commitment to 100% transparent sourcing and community empowerment.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTei7CRren2b2wvwoQd303617x2RFFaNzboNnLxm8AVEBnUs_ODHs6tMy8hi7MBMAQu0OaOeJ9nrnbOwZjtw0R6Tpul8-hxdl1RFblU6QCyDXha52F2TJIHkQZBwnkMZWcoO9et84IuZFIRGk11Fhkm11B8tNqvLCBXQfK3fp7qf-N2yLAb1qLa98LrYiY58UhX6lMruuqrcHoSCCbuPRbiI4F_hUBtQZ8cru11MIkQHJlU46leRjxaWV3eAgfU2pPm_RbmOR-YPqs"
  }
];
export const SAMPLE_STONES = [
  { name: "Sapphire", category: "SAPPHIRE", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKIvo009F0w3zUdMGTOaqeLTlvIr1SDLQzcQ1CupkD17uzCAXgnVfk09S_2G5NsM_QNqRBndFAwwmmfZuiK4vfoSqqEXXbvh94W5rt0Ut4Jr9U9msgkX6Y4_n8ysO5O7JP77OJcBCsjFzHpm7NObPB3dStYaLdbpnAgYcqMRF5iRNth4FEgBFFRnWhd9iJ-qBvjj2ewsKIG-uWv5s-CWt9RiApAL-4V1hA41LlAkpJ76liIQKHCfTA1nfTZa8Ab30j05GiegVezeRA" },
  { name: "Emerald", category: "EMERALD", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7Van6szXOEJ8DlJYuTChB69sjTsYpzPtPwWakSMke_b8LrE3cOaSevFkGqq1fC0Ea59-qRBH1VURL_jJDKHjodLnj4lTr_yVoIEfO52Ov9-ZfgT9dKY2U8m9akgnbv31ieFeKhdlgf3SWRQqFfyUk1BekQRbq4ZpbAll5dKX4qzkqjSaFQ2uk00CyOjej3tTjHq_0asSu74_2JRsHqJUYicjjTIZnELsNZzZmv99SHrqPuRtIuTWPbMFWWqzrT0oCZNJaWxRLLntM" },
  { name: "Ruby", category: "RUBY", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrY3nuWTHsyI1bQA5CdPuV55ZGgQFWve_0Zga2vw2OgnRZzj_83rNnX0-IpqPhT8jqF1EWjSQUPjOg7RJ_7P5tBRPGk7A_zGAjx_SLEwNuKfwBfRly0uVUjHlIiWDLWpkpF9VcF5cWHkqL-_heB2aF6Y7uwItZLQfir7rdXkDGuMX_iUBaS2KMBIgiLqq1NpwLSaONHeMJ_wLNyGs_GKJBmfM3M3yeL9I5DQXYIuCJVGs8zkOVlMoX_wV5X7Ju_k9Ijth8332cNDGV" },
  { name: "Diamond", category: "DIAMOND", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUMLc3lodi4wGMkM7pNaIXz9DRp6F2Iwv4aljmig-32VQTf24WkqCVCKoG-8E7mUd7kvdxT7ps5RNU6MZfAiM2A20MfLlxjF5GJaP8UXqtPuMQTapDa4g_VngVhELLruxWcvrTwzBt5aeeLBaQshANkMPGD9Y4d_9UZsE-lwPNKvO8HO01QMFGz8k6OYclY8AjLHKQnIpKIFCi5Mtvg58x4vvCc8nQkEMueyZsu3JqPnffx9c77jT6IFVPiE6ZMRi8kJLfd-d_fLoG" },
  { name: "Morganite", category: "MORGANITE", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDixEd9Ews1hk-HgQq_3ZJD4B-Qw3z47U3ZJtg5_ktppjcpIO8rt-YhZVqinpcpZfuANRLgLQ2gcPOZn0t9tLJTUDs0JfLAgPLNUDPIYbfhFDAlaT08u_DNYZ-2vkGc7i-KPw59CbjEIXJX3jpcKVmal7277blBCObARjXeqmZfUa66YNzq1bEcBkSyirMqxx9F3bu1et84QaA5OnA339Rz7Fyt3csW7wlX8mrn9YUpF2t8TNIZeG85SyNMdDlGznpre0OdUVtGu0gp" },
  { name: "Opal", category: "OPAL", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTWCNjmc-rfx2CfKzCp_VNz7MnZCpRu02nQX_tmxYvbwntVtmLsAAYmMMm5gd9QW9yyWKKzXWfhTD_ITKP6MBFhOh4xsJy__tFRYBlkHdHz-pE98ecXSweLC2jq3cCbigXmiVw2TyDTciz6rR17ZglAd8Adol97NnTx5a85zONW9frazDkSO5Zu2OLsxuhVfqBR-4dqXeYF0-vJU5sSsxWbj5Uf4h8Gfoi-P510oD_d3N54ArGtp_sKRT-dPHbKQsPXUtA-aj6Bj3j" }
];

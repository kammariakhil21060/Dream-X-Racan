import { createRequire } from "module"; const require = createRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/db/index.ts
var db_exports = {};
__export(db_exports, {
  close: () => close,
  db: () => db,
  migrate: () => migrate,
  transaction: () => transaction
});
import "dotenv/config";
import { PGlite } from "@electric-sql/pglite";
import pg from "pg";
import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
function serialized(fn) {
  const next = queue.then(fn, fn);
  queue = next.catch(() => {
  });
  return next;
}
async function transaction(fn) {
  if (embedded) return serialized(() => embedded.transaction((tx) => fn(tx)));
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
async function migrate() {
  const schemaPath = process.env.VERCEL ? path.resolve(process.cwd(), "server/db/schema.sql") : new URL("./schema.sql", import.meta.url);
  const sql = readFileSync(schemaPath, "utf8");
  if (embedded) await embedded.exec(sql);
  else await pool.query(sql);
}
async function close() {
  if (pool) await pool.end();
  else await embedded.close();
}
var production, embedded, pool, queue, db;
var init_db = __esm({
  "server/db/index.ts"() {
    "use strict";
    production = process.env.NODE_ENV === "production";
    if (production && !process.env.DATABASE_URL && !process.env.VERCEL) throw new Error("DATABASE_URL is required in production");
    pool = process.env.DATABASE_URL ? new pg.Pool({ connectionString: process.env.DATABASE_URL }) : void 0;
    if (!pool) {
      const dataDir = process.env.DATA_DIR || (process.env.VERCEL ? "/tmp/racan" : ".data/racan");
      if (!process.env.VERCEL) mkdirSync(".data", { recursive: true });
      embedded = new PGlite(dataDir);
    }
    queue = Promise.resolve();
    db = { query: async (sql, params = []) => pool ? pool.query(sql, params) : serialized(() => embedded.query(sql, params)) };
  }
});

// server/index.ts
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimit as rateLimit2 } from "express-rate-limit";
import path3 from "node:path";
import { ZodError } from "zod";

// server/seed.ts
init_db();

// shared/catalog.ts
var categories = ["All", "Dresses", "Ethnic Wear", "Tops", "Bags", "Jewellery", "Footwear", "Beauty", "Accessories"];
var brands = [
  { id: "suta", name: "suta", tagline: "Stories woven with love", category: "Ethnic Wear", color: "#f4ede6", ink: "#765741" },
  { id: "summer", name: "SUMMER", tagline: "Made for slow Sundays", category: "Dresses", color: "#e9efdf", ink: "#566444" },
  { id: "the-label-life", name: "THE LABEL LIFE", tagline: "Considered. Effortless. You.", category: "Tops", color: "#f0e8e4", ink: "#4e3c34" },
  { id: "okhai", name: "okhai", tagline: "Handmade, with heart", category: "Ethnic Wear", color: "#f8eee1", ink: "#965330" },
  { id: "nori", name: "nori.", tagline: "A little out of the ordinary", category: "Bags", color: "#e5e8f2", ink: "#505b7a" },
  { id: "palmonas", name: "PALMONAS", tagline: "Everyday, a little golden", category: "Jewellery", color: "#f0e8dd", ink: "#705b3a" },
  { id: "house-of-soi", name: "HOUSE OF SOI", tagline: "For your everyday rituals", category: "Beauty", color: "#f5e4e3", ink: "#a15362" },
  { id: "sole-story", name: "sole story", tagline: "Go your own way", category: "Footwear", color: "#e7ebe2", ink: "#59634e" },
  { id: "not-so-basic", name: "not so basic", tagline: "Dress like yourself", category: "Tops", color: "#f5dfea", ink: "#9c3d6a" },
  { id: "maati", name: "maati", tagline: "Rooted in the earth", category: "Dresses", color: "#e9dfd2", ink: "#7a5c43" },
  { id: "aarika", name: "AARIKA", tagline: "Little things, beautifully made", category: "Accessories", color: "#ede5f1", ink: "#806689" },
  { id: "truebrowns", name: "trueBrowns", tagline: "Tradition in a new light", category: "Ethnic Wear", color: "#e9dddb", ink: "#78504c" }
];
var styles = [
  ["The Sunday Linen Dress", "summer", "Dresses", 2490, "dress", "Bestseller"],
  ["Everyday Mini Shoulder Bag", "nori", "Bags", 1890, "bag", "New drop"],
  ["Golden Hour Hoop Earrings", "palmonas", "Jewellery", 1299, "jewel", "Trending"],
  ["The Everyday Cotton Co-ord", "the-label-life", "Tops", 3290, "top", "Editor\u2019s pick"],
  ["Wildflower Handwoven Saree", "suta", "Ethnic Wear", 4250, "ethnic", "Handcrafted"],
  ["Soft Steps Slingback Heels", "sole-story", "Footwear", 2190, "shoes", "New drop"],
  ["Dewy Days Essentials", "house-of-soi", "Beauty", 1490, "beauty", "Bestseller"],
  ["The City Girl Blazer", "not-so-basic", "Tops", 2890, "street", "Trending"],
  ["Meadow Cotton Midi", "maati", "Dresses", 2790, "dress", "Conscious"],
  ["The Weekend Tote", "aarika", "Accessories", 1590, "bag", "New drop"],
  ["Blockprint Summer Kurta", "okhai", "Ethnic Wear", 2650, "ethnic", "Handcrafted"],
  ["Earthtone Wrap Set", "truebrowns", "Ethnic Wear", 3890, "top", "Editor\u2019s pick"]
];
var products = Array.from({ length: 36 }, (_, i) => {
  const s = styles[i % 12];
  return { id: `p${i + 1}`, name: (i < 12 ? "" : i < 24 ? "Classic " : "Signature ") + s[0], brand_id: s[1], category: s[2], price: s[3] + Math.floor(i / 12) * 200, original_price: Math.round((s[3] + Math.floor(i / 12) * 200) * 1.25), image: `/images/${s[4]}.jpg`, badge: s[5], audience: i % 3 === 0 ? "gen-z" : "women", rating: 4.6 + i % 4 / 10, description: "Thoughtfully made for the moments that make you, you. Beautiful details, an effortless silhouette, and a little everyday joy. Designed in India by an independent label.", status: "published", sizes: ["Bags", "Jewellery", "Beauty", "Accessories"].includes(s[2]) ? ["One size"] : ["XS", "S", "M", "L", "XL"], colors: ["Natural", "Rose", "Black"] };
});
var reels = Array.from({ length: 12 }, (_, i) => ({ id: `r${i + 1}`, brand_id: products[i].brand_id, product_id: products[i].id, caption: ["Your next everyday favourite \u2728", "One look, so many possibilities.", "A little golden hour magic.", "Get ready with us. Your way."][i % 4], image: products[[0, 7, 3, 4, 8, 1, 2, 5, 6, 9, 10, 11][i]].image, video: "/videos/fashion.mp4", creator: ["Ananya", "Isha", "Meera", "Riya"][i % 4], likes: 128 + i * 79, views: 2100 + i * 1360 }));

// server/seed.ts
import { hash } from "bcryptjs";
import { randomBytes } from "node:crypto";
async function seed() {
  await migrate();
  if ((await db.query("SELECT id FROM users LIMIT 1")).rows.length) return;
  if (process.env.NODE_ENV === "production" && !process.env.SEED_PASSWORD) throw new Error("Set SEED_PASSWORD for initial setup");
  const password = process.env.SEED_PASSWORD || randomBytes(18).toString("base64url");
  const digest2 = await hash(password, 12);
  await transaction(async (tx) => {
    for (const [id, name, role2] of [["demo-user", "Ananya Sharma", "USER"], ["demo-seller", "Meera Kapoor", "SELLER"], ["demo-admin", "RACAN Studio", "ADMIN"], ["demo-seller-2", "Isha Rao", "SELLER"]]) {
      await tx.query("INSERT INTO users(id,email,password_hash,name,role) VALUES($1,$2,$3,$4,$5)", [id, `${id.replace("demo-", "")}@racan.local`, digest2, name, role2]);
      await tx.query("INSERT INTO profiles(user_id,bio) VALUES($1,$2)", [id, "Finding beauty in the everyday."]);
    }
    await tx.query("INSERT INTO admin_users VALUES('demo-admin')");
    for (const c of categories.filter((c2) => c2 !== "All")) await tx.query("INSERT INTO categories(name) VALUES($1)", [c]);
    for (const [i, b] of brands.entries()) await tx.query("INSERT INTO brands(id,owner_id,name,tagline,description,category,color,ink,verified,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,true,'approved')", [b.id, i % 2 ? "demo-seller" : "demo-seller-2", b.name, b.tagline, "An independent Indian label creating thoughtful pieces for your everyday. Discover beautiful design, considered materials, and the people behind every piece.", b.category, b.color, b.ink]);
    for (const p of products) {
      await tx.query("INSERT INTO products(id,brand_id,name,description,category,price,original_price,image,badge,audience,rating,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)", [p.id, p.brand_id, p.name, p.description, p.category, p.price, p.original_price, p.image, p.badge, p.audience, p.rating, p.status]);
      await tx.query("INSERT INTO product_images(id,product_id,url) VALUES($1,$2,$3)", [`img-${p.id}`, p.id, p.image]);
      for (const size of p.sizes) for (const color of p.colors) {
        const id = `${p.id}-${size}-${color}`;
        await tx.query("INSERT INTO product_variants(id,product_id,sku,size,color) VALUES($1,$2,$1,$3,$4)", [id, p.id, size, color]);
        await tx.query("INSERT INTO inventory(variant_id,quantity) VALUES($1,20)", [id]);
      }
    }
    for (const r of reels) await tx.query("INSERT INTO reels(id,brand_id,product_id,caption,image,video,creator,likes,views) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)", [r.id, r.brand_id, r.product_id, r.caption, r.image, r.video, r.creator, r.likes, r.views]);
    for (const [id, name, price, pl, rl, features] of [["free", "Free", 0, 25, 5, ["Your own brand storefront", "25 product listings", "5 shoppable Reels"]], ["premium", "Premium", null, 150, 40, ["150 product listings", "40 shoppable Reels", "Featured placement eligibility", "Audience insights"]], ["pro", "Pro", null, 1e3, 200, ["1,000 product listings", "200 shoppable Reels", "Advanced analytics", "Priority support"]]]) await tx.query("INSERT INTO premium_plans VALUES($1,$2,$3,$4,$5,$6)", [id, name, price, pl, rl, JSON.stringify(features)]);
    await tx.query("INSERT INTO advertisements(id,title,description,image,target_url,placement,status) VALUES('ad1','Find your kind of beautiful.','Independent brands. Fresh perspectives. A style that feels like you.','/images/hero.jpg','/women','Landing Top','Active'),('ad2','A little bold. Entirely you.','Meet the next generation of style.','/images/street.jpg','/gen-z','Landing Top','Active'),('ad3','Good things come from her.','Discover the women building something beautiful.','/images/ethnic.jpg','/brands','Landing Middle','Active')");
    await tx.query(`INSERT INTO settings VALUES('platform','{"name":"RACAN","shipping":99,"freeShippingThreshold":2999}')`);
  });
  console.log("Seeded RACAN: 12 brands, 36 products, 12 Reels.");
  if (!process.env.SEED_PASSWORD) console.log(`Local seed password (all *@racan.local accounts): ${password}`);
}
if (process.argv[1]?.endsWith("seed.ts")) {
  await seed();
  await close();
}

// server/index.ts
init_db();

// server/modules/auth.ts
init_db();
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { hash as hash2, compare } from "bcryptjs";
import { randomBytes as randomBytes2, createHash, randomUUID } from "node:crypto";
import { z } from "zod";

// server/lib/errors.ts
var HttpError = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
  status;
};
function assert(condition, status, message) {
  if (!condition) throw new HttpError(status, message);
}

// server/modules/auth.ts
var digest = (token) => createHash("sha256").update(token).digest("hex");
var identify = async (req, _res, next) => {
  try {
    if (req.cookies.racan_session) {
      const { rows } = await db.query("SELECT u.id,u.name,u.email,u.role FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token_hash=$1 AND s.expires_at>now() AND NOT u.disabled AND u.deleted_at IS NULL", [digest(req.cookies.racan_session)]);
      req.user = rows[0];
    }
    next();
  } catch (e) {
    next(e);
  }
};
var requireUser = (req, _res, next) => {
  assert(req.user, 401, "Sign in to continue");
  next();
};
var role = (...roles) => (req, _res, next) => {
  assert(req.user, 401, "Sign in to continue");
  assert(roles.includes(req.user.role), 403, "You do not have access to this area");
  next();
};
var auth = Router();
auth.use(rateLimit({ windowMs: 15 * 60 * 1e3, limit: 80, standardHeaders: "draft-7", legacyHeaders: false }));
async function session(res, user) {
  const token = randomBytes2(32).toString("base64url");
  await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '7 days')", [digest(token), user.id]);
  res.cookie("racan_session", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 6048e5, path: "/" });
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
auth.get("/me", (req, res) => res.json(req.user || null));
auth.post("/register", async (req, res) => {
  const v = z.object({ name: z.string().min(2).max(80), email: z.string().email().max(254).transform((s) => s.toLowerCase()), password: z.string().min(10).max(128), seller: z.boolean().optional() }).parse(req.body);
  assert(!(await db.query("SELECT id FROM users WHERE email=$1", [v.email])).rows.length, 409, "This email is already registered");
  const u = { id: randomUUID(), name: v.name, email: v.email, role: v.seller ? "SELLER" : "USER" };
  const ph = await hash2(v.password, 12);
  await transaction(async (tx) => {
    await tx.query("INSERT INTO users(id,name,email,password_hash,role) VALUES($1,$2,$3,$4,$5)", [u.id, u.name, u.email, ph, u.role]);
    await tx.query("INSERT INTO profiles(user_id) VALUES($1)", [u.id]);
  });
  res.status(201).json(await session(res, u));
});
auth.post("/login", async (req, res) => {
  const v = z.object({ email: z.string().email(), password: z.string().max(128) }).parse(req.body);
  const u = (await db.query("SELECT * FROM users WHERE email=$1 AND NOT disabled AND deleted_at IS NULL", [v.email.toLowerCase()])).rows[0];
  assert(u && await compare(v.password, u.password_hash), 401, "Email or password is incorrect");
  res.json(await session(res, u));
});
auth.post("/demo", async (req, res) => {
  assert(process.env.NODE_ENV !== "production", 404, "Not found");
  const r = z.enum(["user", "seller", "admin"]).parse(req.body.role);
  const u = (await db.query("SELECT * FROM users WHERE id=$1", [`demo-${r}`])).rows[0];
  res.json(await session(res, u));
});
auth.post("/logout", async (req, res) => {
  if (req.cookies.racan_session) await db.query("DELETE FROM sessions WHERE token_hash=$1", [digest(req.cookies.racan_session)]);
  res.clearCookie("racan_session", { path: "/" }).json({ ok: true });
});
auth.post("/forgot", async (req, res) => {
  const { email } = z.object({ email: z.string().email() }).parse(req.body);
  assert(process.env.NODE_ENV !== "production", 503, "Password reset is temporarily unavailable. Please contact support.");
  const u = (await db.query("SELECT id FROM users WHERE email=$1", [email.toLowerCase()])).rows[0];
  let resetUrl;
  if (u) {
    const token = randomBytes2(32).toString("base64url");
    await db.query("INSERT INTO password_resets VALUES($1,$2,now()+interval '30 minutes',false)", [digest(token), u.id]);
    if (process.env.NODE_ENV !== "production") resetUrl = `/reset-password?token=${token}`;
    else throw new Error("Transactional email adapter is not configured");
  }
  res.json({ message: "If the account exists, a password reset has been requested.", resetUrl });
});
auth.post("/reset", async (req, res) => {
  const v = z.object({ token: z.string().min(32), password: z.string().min(10).max(128) }).parse(req.body);
  const ph = await hash2(v.password, 12);
  await transaction(async (tx) => {
    const t = (await tx.query("UPDATE password_resets SET used=true WHERE token_hash=$1 AND expires_at>now() AND NOT used RETURNING user_id", [digest(v.token)])).rows[0];
    assert(t, 400, "This reset link is invalid or expired");
    await tx.query("UPDATE users SET password_hash=$1 WHERE id=$2", [ph, t.user_id]);
    await tx.query("DELETE FROM sessions WHERE user_id=$1", [t.user_id]);
  });
  res.json({ ok: true });
});

// server/modules/catalog.ts
init_db();
import { Router as Router2 } from "express";
import { z as z2 } from "zod";
var catalog = Router2();
var productSelect = `SELECT p.*, b.name AS brand_name, (SELECT json_agg(json_build_object('id',v.id,'size',v.size,'color',v.color,'stock',i.quantity) ORDER BY v.size) FROM product_variants v JOIN inventory i ON i.variant_id=v.id WHERE v.product_id=p.id) AS variants FROM products p JOIN brands b ON b.id=p.brand_id`;
catalog.get("/catalog", async (req, res) => {
  const v = z2.object({ q: z2.string().max(100).default(""), category: z2.string().max(80).default("All"), audience: z2.string().max(20).default(""), brand: z2.string().max(100).default(""), sort: z2.enum(["trending", "price-low", "price-high", "newest"]).default("trending"), page: z2.coerce.number().int().min(1).max(1e3).default(1), limit: z2.coerce.number().int().min(1).max(60).default(36) }).parse(req.query);
  const params = [`%${v.q}%`, v.category, v.audience, v.brand];
  const where = ` WHERE p.status='published' AND p.deleted_at IS NULL AND b.status='approved' AND b.deleted_at IS NULL AND (p.name ILIKE $1 OR b.name ILIKE $1 OR p.category ILIKE $1) AND ($2='All' OR p.category=$2) AND ($3='' OR p.audience=$3) AND ($4='' OR p.brand_id=$4)`;
  const order = { trending: "p.rating DESC", "price-low": "p.price ASC", "price-high": "p.price DESC", newest: "p.created_at DESC" }[v.sort];
  const [p, b, r, a, plans, c] = await Promise.all([db.query(productSelect + where + ` ORDER BY ${order},p.id LIMIT $5 OFFSET $6`, [...params, v.limit, (v.page - 1) * v.limit]), db.query("SELECT b.*,(SELECT count(*)::int FROM brand_followers f WHERE f.brand_id=b.id) AS followers FROM brands b WHERE status='approved' AND deleted_at IS NULL ORDER BY created_at,id"), db.query("SELECT r.*,(r.likes+(SELECT count(*)::int FROM reel_likes l WHERE l.reel_id=r.id)) AS likes,b.name AS brand_name FROM reels r JOIN brands b ON b.id=r.brand_id WHERE r.status='published' AND r.deleted_at IS NULL AND b.status='approved' ORDER BY r.id LIMIT 30"), db.query("SELECT * FROM advertisements WHERE status='Active' AND (start_date IS NULL OR start_date<=now()) AND (end_date IS NULL OR end_date>now())"), db.query("SELECT * FROM premium_plans ORDER BY product_limit"), db.query("SELECT count(*)::int AS total FROM products p JOIN brands b ON b.id=p.brand_id" + where, params)]);
  res.json({ products: p.rows, brands: b.rows, reels: r.rows, ads: a.rows, plans: plans.rows, total: c.rows[0].total, page: v.page });
});
catalog.get("/products/:id", async (req, res) => {
  const p = (await db.query(productSelect + " WHERE p.id=$1 AND p.status='published' AND p.deleted_at IS NULL AND b.status='approved'", [req.params.id])).rows[0];
  assert(p, 404, "Product not found");
  p.images = (await db.query("SELECT * FROM product_images WHERE product_id=$1 ORDER BY position", [p.id])).rows;
  p.reviews = (await db.query("SELECT r.*,u.name FROM reviews r JOIN users u ON u.id=r.user_id WHERE product_id=$1 ORDER BY created_at DESC LIMIT 30", [p.id])).rows;
  res.json(p);
});
catalog.get("/brands/:id/posts", async (req, res) => res.json((await db.query("SELECT p.* FROM posts p JOIN brands b ON b.id=p.brand_id WHERE b.id=$1 AND b.status='approved' AND p.status='published' ORDER BY p.created_at DESC LIMIT 30", [req.params.id])).rows));
catalog.get("/creators/:id", async (req, res) => {
  const u = (await db.query("SELECT u.id,u.name,p.bio,p.image,(SELECT count(*)::int FROM follows WHERE following_id=u.id) AS followers FROM users u LEFT JOIN profiles p ON p.user_id=u.id WHERE u.id=$1 AND u.role='SELLER' AND NOT u.disabled AND u.deleted_at IS NULL", [req.params.id])).rows[0];
  assert(u, 404, "Creator not found");
  u.brands = (await db.query("SELECT * FROM brands WHERE owner_id=$1 AND status='approved' AND deleted_at IS NULL", [u.id])).rows;
  u.reels = (await db.query("SELECT r.*,(r.likes+(SELECT count(*)::int FROM reel_likes l WHERE l.reel_id=r.id)) AS likes,b.name AS brand_name FROM reels r JOIN brands b ON b.id=r.brand_id WHERE b.owner_id=$1 AND b.status='approved' AND r.status='published' AND r.deleted_at IS NULL LIMIT 30", [u.id])).rows;
  res.json(u);
});
catalog.get("/search", async (req, res) => {
  const q = z2.string().min(1).max(100).parse(req.query.q);
  const term = `%${q}%`;
  const [products2, brands2, reels2, creators, categories2] = await Promise.all([db.query("SELECT p.id,p.name,p.image,b.name AS brand_name FROM products p JOIN brands b ON b.id=p.brand_id WHERE p.status='published' AND p.deleted_at IS NULL AND b.status='approved' AND (p.name ILIKE $1 OR p.category ILIKE $1 OR b.name ILIKE $1) LIMIT 6", [term]), db.query("SELECT id,name FROM brands WHERE status='approved' AND deleted_at IS NULL AND name ILIKE $1 LIMIT 4", [term]), db.query("SELECT r.id,r.caption,r.image,r.creator FROM reels r JOIN brands b ON b.id=r.brand_id WHERE r.status='published' AND r.deleted_at IS NULL AND b.status='approved' AND (r.caption ILIKE $1 OR r.creator ILIKE $1 OR b.name ILIKE $1) LIMIT 4", [term]), db.query("SELECT id,name FROM users WHERE role='SELLER' AND NOT disabled AND deleted_at IS NULL AND name ILIKE $1 LIMIT 4", [term]), db.query("SELECT name FROM categories WHERE name ILIKE $1 LIMIT 5", [term])]);
  res.json({ products: products2.rows, brands: brands2.rows, reels: reels2.rows, creators: creators.rows, categories: categories2.rows });
});

// server/modules/social.ts
init_db();
import { Router as Router3 } from "express";
import { randomUUID as randomUUID2 } from "node:crypto";
import { z as z3 } from "zod";
var social = Router3();
social.get("/reels/:id/comments", async (req, res) => res.json((await db.query("SELECT c.*,u.name FROM reel_comments c JOIN users u ON u.id=c.user_id WHERE reel_id=$1 ORDER BY c.created_at DESC LIMIT 100", [req.params.id])).rows));
social.use(requireUser);
social.post("/reels/:id/view", async (req, res) => {
  await transaction(async (tx) => {
    const added = await tx.query("INSERT INTO reel_viewers(user_id,reel_id) VALUES($1,$2) ON CONFLICT DO NOTHING RETURNING reel_id", [req.user.id, req.params.id]);
    if (added.rows.length) await tx.query("UPDATE reels SET views=views+1 WHERE id=$1", [req.params.id]);
  });
  res.json({ ok: true });
});
social.put("/creators/:id/follow", async (req, res) => {
  const { active } = z3.object({ active: z3.boolean() }).parse(req.body);
  assert(req.params.id !== req.user.id, 400, "You cannot follow yourself");
  assert((await db.query("SELECT id FROM users WHERE id=$1 AND role='SELLER' AND NOT disabled", [req.params.id])).rows.length, 404, "Creator not found");
  if (active) await db.query("INSERT INTO follows VALUES($1,$2) ON CONFLICT DO NOTHING", [req.user.id, req.params.id]);
  else await db.query("DELETE FROM follows WHERE follower_id=$1 AND following_id=$2", [req.user.id, req.params.id]);
  res.json({ active });
});
social.get("/creators/:id/following", async (req, res) => res.json({ active: !!(await db.query("SELECT 1 FROM follows WHERE follower_id=$1 AND following_id=$2", [req.user.id, req.params.id])).rows.length }));
social.get("/my", async (req, res) => {
  const uid = req.user.id;
  const [w, f, l, s, n, p] = await Promise.all([db.query("SELECT product_id FROM wishlist_items WHERE wishlist_id=$1", [uid]), db.query("SELECT brand_id FROM brand_followers WHERE user_id=$1", [uid]), db.query("SELECT reel_id FROM reel_likes WHERE user_id=$1", [uid]), db.query("SELECT reel_id FROM reel_saves WHERE user_id=$1", [uid]), db.query("SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 30", [uid]), db.query("SELECT * FROM profiles WHERE user_id=$1", [uid])]);
  res.json({ wishlist: w.rows.map((x) => x.product_id), following: f.rows.map((x) => x.brand_id), likes: l.rows.map((x) => x.reel_id), saved: s.rows.map((x) => x.reel_id), notifications: n.rows, profile: p.rows[0] });
});
social.put("/profile", async (req, res) => {
  const v = z3.object({ name: z3.string().min(2).max(80), bio: z3.string().max(400) }).parse(req.body);
  await transaction(async (tx) => {
    await tx.query("UPDATE users SET name=$1 WHERE id=$2", [v.name, req.user.id]);
    await tx.query("UPDATE profiles SET bio=$1 WHERE user_id=$2", [v.bio, req.user.id]);
  });
  res.json({ ok: true });
});
social.put("/wishlist/:id", async (req, res) => {
  const { active } = z3.object({ active: z3.boolean() }).parse(req.body);
  await transaction(async (tx) => {
    await tx.query("INSERT INTO wishlists(id,user_id) VALUES($1,$1) ON CONFLICT DO NOTHING", [req.user.id]);
    if (active) await tx.query("INSERT INTO wishlist_items VALUES($1,$2,now()) ON CONFLICT DO NOTHING", [req.user.id, req.params.id]);
    else await tx.query("DELETE FROM wishlist_items WHERE wishlist_id=$1 AND product_id=$2", [req.user.id, req.params.id]);
  });
  res.json({ active });
});
social.put("/follow/:id", async (req, res) => {
  const { active } = z3.object({ active: z3.boolean() }).parse(req.body);
  if (active) await transaction(async (tx) => {
    const inserted = await tx.query("INSERT INTO brand_followers VALUES($1,$2,now()) ON CONFLICT DO NOTHING RETURNING brand_id", [req.user.id, req.params.id]);
    if (inserted.rows.length) await tx.query("INSERT INTO notifications(id,user_id,message) SELECT $1,owner_id,$2 FROM brands WHERE id=$3", [randomUUID2(), `${req.user.name} started following your brand`, req.params.id]);
  });
  else await db.query("DELETE FROM brand_followers WHERE user_id=$1 AND brand_id=$2", [req.user.id, req.params.id]);
  res.json({ active });
});
social.put("/reels/:id/:action", async (req, res) => {
  const action = z3.enum(["like", "save"]).parse(req.params.action);
  const { active } = z3.object({ active: z3.boolean() }).parse(req.body);
  const table = action === "like" ? "reel_likes" : "reel_saves";
  if (active) await db.query(`INSERT INTO ${table} VALUES($1,$2) ON CONFLICT DO NOTHING`, [req.user.id, req.params.id]);
  else await db.query(`DELETE FROM ${table} WHERE user_id=$1 AND reel_id=$2`, [req.user.id, req.params.id]);
  res.json({ active });
});
social.post("/reels/:id/comments", async (req, res) => {
  const { body } = z3.object({ body: z3.string().trim().min(1).max(1e3) }).parse(req.body);
  await db.query("INSERT INTO reel_comments(id,user_id,reel_id,body) VALUES($1,$2,$3,$4)", [randomUUID2(), req.user.id, req.params.id, body]);
  res.status(201).json({ ok: true });
});
social.post("/reels/:id/share", async (req, res) => {
  await db.query("INSERT INTO reel_shares(id,user_id,reel_id) VALUES($1,$2,$3)", [randomUUID2(), req.user.id, req.params.id]);
  res.json({ ok: true });
});
social.post("/reports", async (req, res) => {
  const v = z3.object({ reel_id: z3.string(), reason: z3.string().min(5).max(1e3) }).parse(req.body);
  await db.query("INSERT INTO reports(id,user_id,reel_id,reason) VALUES($1,$2,$3,$4)", [randomUUID2(), req.user.id, v.reel_id, v.reason]);
  res.status(201).json({ ok: true });
});
social.post("/reviews", async (req, res) => {
  const v = z3.object({ product_id: z3.string(), rating: z3.number().int().min(1).max(5), body: z3.string().min(3).max(1500) }).parse(req.body);
  assert((await db.query("SELECT 1 FROM order_items i JOIN orders o ON o.id=i.order_id WHERE o.user_id=$1 AND i.product_id=$2 AND o.status='Delivered'", [req.user.id, v.product_id])).rows.length, 403, "Reviews are available after your order is delivered");
  await db.query("INSERT INTO reviews(id,user_id,product_id,rating,body) VALUES($1,$2,$3,$4,$5) ON CONFLICT(user_id,product_id) DO UPDATE SET rating=$4,body=$5", [randomUUID2(), req.user.id, v.product_id, v.rating, v.body]);
  res.json({ ok: true });
});
social.put("/notifications/read", async (req, res) => {
  await db.query("UPDATE notifications SET read=true WHERE user_id=$1", [req.user.id]);
  res.json({ ok: true });
});

// server/modules/commerce.ts
init_db();
import { Router as Router4 } from "express";
import { randomUUID as randomUUID3 } from "node:crypto";
import { z as z4 } from "zod";

// server/modules/payments.ts
var DevelopmentPaymentProvider = class {
  name = "development";
  async authorize(amount) {
    assert(process.env.NODE_ENV !== "production", 503, "Development payments are disabled in production");
    assert(Number.isInteger(amount) && amount >= 0, 400, "Invalid amount");
    return { status: "Successful", reference: `dev-${crypto.randomUUID()}` };
  }
};
function paymentProvider() {
  assert(!process.env.PAYMENT_PROVIDER || process.env.PAYMENT_PROVIDER === "development", 503, "Payment provider is not configured");
  return new DevelopmentPaymentProvider();
}

// server/modules/commerce.ts
var commerce = Router4();
commerce.use(requireUser);
var cartSQL = `SELECT c.variant_id,c.quantity,v.size,v.color,i.quantity AS stock,p.id AS product_id,p.name,p.price,p.image,p.brand_id,b.name AS brand_name,p.status,p.deleted_at,b.status AS brand_status FROM cart_items c JOIN product_variants v ON v.id=c.variant_id JOIN inventory i ON i.variant_id=v.id JOIN products p ON p.id=v.product_id JOIN brands b ON b.id=p.brand_id WHERE c.cart_id=$1 ORDER BY c.variant_id`;
commerce.get("/cart", async (req, res) => res.json((await db.query(cartSQL, [req.user.id])).rows));
commerce.put("/cart", async (req, res) => {
  const v = z4.object({ variant_id: z4.string().max(150), quantity: z4.number().int().min(0).max(20) }).parse(req.body);
  await transaction(async (tx) => {
    await tx.query("INSERT INTO carts(id,user_id) VALUES($1,$1) ON CONFLICT DO NOTHING", [req.user.id]);
    if (!v.quantity) {
      await tx.query("DELETE FROM cart_items WHERE cart_id=$1 AND variant_id=$2", [req.user.id, v.variant_id]);
      return;
    }
    const stock = (await tx.query("SELECT i.quantity FROM inventory i JOIN product_variants v ON v.id=i.variant_id JOIN products p ON p.id=v.product_id JOIN brands b ON b.id=p.brand_id WHERE v.id=$1 AND p.status='published' AND p.deleted_at IS NULL AND b.status='approved'", [v.variant_id])).rows[0];
    assert(stock && stock.quantity >= v.quantity, 409, "This quantity is no longer available");
    await tx.query("INSERT INTO cart_items VALUES($1,$2,$3) ON CONFLICT(cart_id,variant_id) DO UPDATE SET quantity=$3", [req.user.id, v.variant_id, v.quantity]);
  });
  res.json({ ok: true });
});
var checkoutSchema = z4.object({ key: z4.string().uuid(), address: z4.object({ name: z4.string().min(2).max(100), phone: z4.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"), line: z4.string().min(8).max(300), city: z4.string().min(2).max(80), pincode: z4.string().regex(/^\d{6}$/, "Enter a 6-digit PIN code") }) });
commerce.post("/checkout", async (req, res) => {
  const v = checkoutSchema.parse(req.body);
  const provider = paymentProvider();
  const order = await transaction(async (tx) => {
    await tx.query("SELECT id FROM users WHERE id=$1 FOR UPDATE", [req.user.id]);
    const old = (await tx.query("SELECT * FROM orders WHERE user_id=$1 AND idempotency_key=$2", [req.user.id, v.key])).rows[0];
    if (old) return old;
    const items = (await tx.query(cartSQL, [req.user.id])).rows;
    assert(items.length, 400, "Your bag is empty");
    let subtotal = 0;
    for (const item of items) {
      assert(item.status === "published" && !item.deleted_at && item.brand_status === "approved", 409, `${item.name} is no longer available`);
      const updated = await tx.query("UPDATE inventory SET quantity=quantity-$1,updated_at=now() WHERE variant_id=$2 AND quantity>=$1 RETURNING quantity", [item.quantity, item.variant_id]);
      assert(updated.rows.length, 409, `${item.name} has insufficient stock`);
      subtotal += item.price * item.quantity;
    }
    const settings = (await tx.query("SELECT value FROM settings WHERE key='platform'")).rows[0].value;
    const shipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.shipping;
    const total = subtotal + shipping;
    const id = "RC-" + randomUUID3().slice(0, 8).toUpperCase();
    const payment = await provider.authorize(total);
    await tx.query("INSERT INTO orders(id,user_id,total,shipping,address,idempotency_key) VALUES($1,$2,$3,$4,$5,$6)", [id, req.user.id, total, shipping, JSON.stringify(v.address), v.key]);
    for (const i of items) await tx.query("INSERT INTO order_items(id,order_id,product_id,variant_id,brand_id,name,image,variant,price,quantity) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", [randomUUID3(), id, i.product_id, i.variant_id, i.brand_id, i.name, i.image, `${i.size} / ${i.color}`, i.price, i.quantity]);
    await tx.query("INSERT INTO payments(id,order_id,provider,amount,status,reference) VALUES($1,$2,$3,$4,$5,$6)", [randomUUID3(), id, provider.name, total, payment.status, payment.reference]);
    await tx.query("DELETE FROM cart_items WHERE cart_id=$1", [req.user.id]);
    await tx.query("INSERT INTO notifications(id,user_id,message) VALUES($1,$2,$3)", [randomUUID3(), req.user.id, `Your order ${id} is confirmed. Thank you for discovering with RACAN.`]);
    return { id, total };
  });
  res.status(201).json(order);
});
commerce.get("/orders", async (req, res) => res.json((await db.query("SELECT o.*,p.status AS payment_status,p.provider,(SELECT json_agg(i.*) FROM order_items i WHERE i.order_id=o.id) AS items FROM orders o JOIN payments p ON p.order_id=o.id WHERE o.user_id=$1 ORDER BY o.created_at DESC", [req.user.id])).rows));
commerce.post("/orders/:id/cancel", async (req, res) => {
  await transaction(async (tx) => {
    const o = (await tx.query("SELECT * FROM orders WHERE id=$1 AND user_id=$2 FOR UPDATE", [req.params.id, req.user.id])).rows[0];
    assert(o, 404, "Order not found");
    assert(["Pending", "Confirmed"].includes(o.status), 409, "This order can no longer be cancelled");
    assert((await tx.query("SELECT provider FROM payments WHERE order_id=$1", [o.id])).rows[0].provider === "development", 409, "Contact support for a refund");
    await tx.query("UPDATE orders SET status='Cancelled' WHERE id=$1", [o.id]);
    await tx.query("UPDATE payments SET status='Refunded' WHERE order_id=$1", [o.id]);
    for (const i of (await tx.query("SELECT * FROM order_items WHERE order_id=$1", [o.id])).rows) await tx.query("UPDATE inventory SET quantity=quantity+$1 WHERE variant_id=$2", [i.quantity, i.variant_id]);
  });
  res.json({ ok: true });
});

// server/modules/management.ts
init_db();
import { Router as Router5 } from "express";
import { randomUUID as randomUUID6 } from "node:crypto";
import { z as z5 } from "zod";

// server/modules/storage.ts
init_db();
import { randomUUID as randomUUID4 } from "node:crypto";
var PostgreSQLStorageService = class {
  async upload(owner, data, mime) {
    const video = mime.startsWith("video/");
    assert(data.length <= (video ? 25 : 5) * 1024 * 1024, 400, video ? "Videos must be 25 MB or smaller" : "Images must be 5 MB or smaller");
    const valid = mime === "image/jpeg" && data[0] === 255 && data[1] === 216 && data[2] === 255 || mime === "image/png" && data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) || mime === "image/webp" && data.subarray(0, 4).toString() === "RIFF" && data.subarray(8, 12).toString() === "WEBP" || mime === "video/mp4" && data.subarray(4, 8).toString() === "ftyp" || mime === "video/webm" && data.subarray(0, 4).equals(Buffer.from([26, 69, 223, 163]));
    assert(valid, 400, "Upload a valid JPEG, PNG, WebP, MP4, or WebM file");
    const id = randomUUID4();
    await db.query("INSERT INTO media(id,owner_id,mime,data) VALUES($1,$2,$3,$4)", [id, owner, mime, data]);
    return `/api/media/${id}`;
  }
  async get(id) {
    const r = (await db.query("SELECT data,mime FROM media WHERE id=$1", [id])).rows[0];
    return r ? { data: Buffer.from(r.data), mime: r.mime } : void 0;
  }
  async delete(id, owner) {
    await db.query("DELETE FROM media WHERE id=$1 AND owner_id=$2", [id, owner]);
  }
};
var storage = new PostgreSQLStorageService();

// server/modules/reels.ts
init_db();
import { randomUUID as randomUUID5 } from "node:crypto";
async function createReel(user, value) {
  await transaction(async (tx) => {
    await tx.query("SELECT id FROM users WHERE id=$1 FOR UPDATE", [user.id]);
    const plan = (await tx.query("SELECT p.* FROM premium_plans p WHERE id=COALESCE((SELECT plan_id FROM subscriptions WHERE user_id=$1 AND status='active'),'free')", [user.id])).rows[0];
    const count = (await tx.query("SELECT count(*)::int AS n FROM reels r JOIN brands b ON b.id=r.brand_id WHERE b.owner_id=$1 AND r.deleted_at IS NULL", [user.id])).rows[0].n;
    assert(count < plan.reel_limit, 403, "Your plan\u2019s Reel limit has been reached");
    await tx.query("INSERT INTO reels(id,brand_id,product_id,caption,image,video,creator,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8)", [randomUUID5(), value.brand_id, value.product_id, value.caption, value.image, value.video, user.name, value.status]);
  });
}

// server/modules/management.ts
var management = Router5();
var safeURL = z5.string().max(500).refine((s) => !s || /^https:\/\//.test(s) || /^\/(?!\/)/.test(s), "Use an https URL or a local path");
var productSchema = z5.object({ name: z5.string().min(3).max(150), description: z5.string().min(10).max(3e3), brand_id: z5.string(), category: z5.string(), price: z5.number().int().min(1).max(1e7), original_price: z5.number().int().min(1).max(1e7), audience: z5.enum(["women", "gen-z"]), status: z5.enum(["draft", "pending"]), images: z5.array(safeURL).min(1).max(8), sizes: z5.array(z5.string().min(1).max(20)).min(1).max(10), colors: z5.array(z5.string().min(1).max(30)).min(1).max(10), stock: z5.number().int().min(0).max(1e4), external_url: safeURL.optional(), instagram: safeURL.optional(), video: safeURL.optional(), tags: z5.array(z5.string().max(40)).max(20).default([]) }).refine((v) => v.original_price >= v.price, { message: "Original price must not be below selling price" });
async function ownsBrand(id, user) {
  const b = (await db.query("SELECT * FROM brands WHERE id=$1 AND deleted_at IS NULL", [id])).rows[0];
  assert(b && (b.owner_id === user.id || user.role === "ADMIN"), 403, "You cannot manage this brand");
  return b;
}
management.post("/upload", role("SELLER", "ADMIN"), async (req, res) => {
  const v = z5.object({ mime: z5.string(), data: z5.string().max(35e6) }).parse(req.body);
  res.status(201).json({ url: await storage.upload(req.user.id, Buffer.from(v.data, "base64"), v.mime) });
});
management.get("/seller", role("SELLER", "ADMIN"), async (req, res) => {
  const owner = req.user.id;
  const [b, p, r, o, posts, plans, sub] = await Promise.all([db.query("SELECT * FROM brands WHERE owner_id=$1 AND deleted_at IS NULL", [owner]), db.query("SELECT p.* FROM products p JOIN brands b ON b.id=p.brand_id WHERE b.owner_id=$1 AND p.deleted_at IS NULL ORDER BY p.created_at DESC", [owner]), db.query("SELECT r.* FROM reels r JOIN brands b ON b.id=r.brand_id WHERE b.owner_id=$1 AND r.deleted_at IS NULL ORDER BY r.created_at DESC", [owner]), db.query("SELECT o.id,o.status,o.created_at,i.name,i.price,i.quantity,i.variant FROM order_items i JOIN orders o ON o.id=i.order_id JOIN brands b ON b.id=i.brand_id WHERE b.owner_id=$1 ORDER BY o.created_at DESC", [owner]), db.query("SELECT p.* FROM posts p JOIN brands b ON b.id=p.brand_id WHERE b.owner_id=$1", [owner]), db.query("SELECT * FROM premium_plans ORDER BY product_limit"), db.query("SELECT * FROM subscriptions WHERE user_id=$1", [owner])]);
  const inventory = (await db.query("SELECT v.*,i.quantity,p.name FROM product_variants v JOIN inventory i ON i.variant_id=v.id JOIN products p ON p.id=v.product_id JOIN brands b ON b.id=p.brand_id WHERE b.owner_id=$1 AND p.deleted_at IS NULL", [owner])).rows;
  res.json({ brands: b.rows, products: p.rows, reels: r.rows, orders: o.rows, posts: posts.rows, plans: plans.rows, subscription: sub.rows[0], inventory });
});
management.post("/seller/brands", role("SELLER", "ADMIN"), async (req, res) => {
  const v = z5.object({ name: z5.string().min(2).max(100), tagline: z5.string().max(150), description: z5.string().min(10).max(2e3), category: z5.string(), website: safeURL.optional(), instagram: safeURL.optional(), image: safeURL.optional(), banner: safeURL.optional() }).parse(req.body);
  const id = randomUUID6();
  await db.query("INSERT INTO brands(id,owner_id,name,tagline,description,category,color,ink,website,instagram,image,banner) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)", [id, req.user.id, v.name, v.tagline, v.description, v.category, "#f2e7e4", "#765741", v.website, v.instagram, v.image, v.banner]);
  res.status(201).json({ id });
});
management.put("/seller/brands/:id", role("SELLER", "ADMIN"), async (req, res) => {
  await ownsBrand(req.params.id, req.user);
  const v = z5.object({ name: z5.string().min(2).max(100), tagline: z5.string().max(150), description: z5.string().min(10).max(2e3), website: safeURL.optional(), instagram: safeURL.optional(), image: safeURL.optional(), banner: safeURL.optional() }).parse(req.body);
  await db.query("UPDATE brands SET name=$1,tagline=$2,description=$3,website=$4,instagram=$5,image=$6,banner=$7,status='pending',verified=false WHERE id=$8", [v.name, v.tagline, v.description, v.website, v.instagram, v.image, v.banner, req.params.id]);
  res.json({ ok: true });
});
management.post("/seller/products", role("SELLER", "ADMIN"), async (req, res) => {
  const v = productSchema.parse(req.body);
  await ownsBrand(v.brand_id, req.user);
  const id = randomUUID6();
  await transaction(async (tx) => {
    await tx.query("SELECT id FROM users WHERE id=$1 FOR UPDATE", [req.user.id]);
    const plan = (await tx.query("SELECT p.* FROM premium_plans p WHERE id=COALESCE((SELECT plan_id FROM subscriptions WHERE user_id=$1 AND status='active'),'free')", [req.user.id])).rows[0];
    const count = (await tx.query("SELECT count(*)::int AS n FROM products p JOIN brands b ON b.id=p.brand_id WHERE b.owner_id=$1 AND p.deleted_at IS NULL", [req.user.id])).rows[0].n;
    assert(count < plan.product_limit, 403, "Your plan\u2019s product limit has been reached");
    await tx.query("INSERT INTO products(id,brand_id,name,description,category,price,original_price,image,audience,status,external_url,instagram,video,tags) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)", [id, v.brand_id, v.name, v.description, v.category, v.price, v.original_price, v.images[0], v.audience, v.status, v.external_url, v.instagram, v.video, v.tags]);
    for (const [position, url] of v.images.entries()) await tx.query("INSERT INTO product_images VALUES($1,$2,$3,$4)", [randomUUID6(), id, url, position]);
    for (const size of new Set(v.sizes)) for (const color of new Set(v.colors)) {
      const vid = randomUUID6();
      await tx.query("INSERT INTO product_variants VALUES($1,$2,$3,$4,$5)", [vid, id, `${id.slice(0, 8)}-${size}-${color}`, size, color]);
      await tx.query("INSERT INTO inventory(variant_id,quantity) VALUES($1,$2)", [vid, v.stock]);
    }
  });
  res.status(201).json({ id });
});
management.put("/seller/products/:id", role("SELLER", "ADMIN"), async (req, res) => {
  const p = (await db.query("SELECT * FROM products WHERE id=$1 AND deleted_at IS NULL", [req.params.id])).rows[0];
  assert(p, 404, "Product not found");
  await ownsBrand(p.brand_id, req.user);
  const v = z5.object({ name: z5.string().min(3).max(150), description: z5.string().min(10).max(3e3), price: z5.number().int().min(1), original_price: z5.number().int().min(1), status: z5.enum(["draft", "pending"]) }).refine((v2) => v2.original_price >= v2.price).parse(req.body);
  await db.query("UPDATE products SET name=$1,description=$2,price=$3,original_price=$4,status=$5 WHERE id=$6", [v.name, v.description, v.price, v.original_price, v.status, req.params.id]);
  res.json({ ok: true });
});
management.delete("/seller/products/:id", role("SELLER", "ADMIN"), async (req, res) => {
  const p = (await db.query("SELECT brand_id FROM products WHERE id=$1", [req.params.id])).rows[0];
  assert(p, 404, "Product not found");
  await ownsBrand(p.brand_id, req.user);
  await db.query("UPDATE products SET deleted_at=now() WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
});
management.put("/seller/inventory/:id", role("SELLER", "ADMIN"), async (req, res) => {
  const { quantity } = z5.object({ quantity: z5.number().int().min(0).max(1e4) }).parse(req.body);
  const v = (await db.query("SELECT p.brand_id FROM product_variants v JOIN products p ON p.id=v.product_id WHERE v.id=$1", [req.params.id])).rows[0];
  assert(v, 404, "Variant not found");
  await ownsBrand(v.brand_id, req.user);
  await db.query("UPDATE inventory SET quantity=$1,updated_at=now() WHERE variant_id=$2", [quantity, req.params.id]);
  res.json({ ok: true });
});
management.post("/seller/reels", role("SELLER", "ADMIN"), async (req, res) => {
  const v = z5.object({ brand_id: z5.string(), product_id: z5.string(), caption: z5.string().min(3).max(500), image: safeURL, video: safeURL.refine((v2) => v2.length > 0), status: z5.enum(["draft", "pending"]) }).parse(req.body);
  await ownsBrand(v.brand_id, req.user);
  assert((await db.query("SELECT id FROM products WHERE id=$1 AND brand_id=$2", [v.product_id, v.brand_id])).rows.length, 400, "Tag a product from the selected brand");
  await createReel(req.user, v);
  res.status(201).json({ ok: true });
});
management.delete("/seller/reels/:id", role("SELLER", "ADMIN"), async (req, res) => {
  const r = (await db.query("SELECT brand_id FROM reels WHERE id=$1", [req.params.id])).rows[0];
  assert(r, 404, "Reel not found");
  await ownsBrand(r.brand_id, req.user);
  await db.query("UPDATE reels SET deleted_at=now() WHERE id=$1", [req.params.id]);
  res.json({ ok: true });
});
management.post("/seller/posts", role("SELLER", "ADMIN"), async (req, res) => {
  const v = z5.object({ brand_id: z5.string(), body: z5.string().min(3).max(3e3), image: safeURL.optional(), status: z5.enum(["draft", "published"]) }).parse(req.body);
  await ownsBrand(v.brand_id, req.user);
  await db.query("INSERT INTO posts(id,brand_id,body,image,status) VALUES($1,$2,$3,$4,$5)", [randomUUID6(), v.brand_id, v.body, v.image, v.status]);
  res.status(201).json({ ok: true });
});
management.post("/seller/subscribe", role("SELLER", "ADMIN"), async (req, res) => {
  const { plan_id } = z5.object({ plan_id: z5.string() }).parse(req.body);
  const p = (await db.query("SELECT * FROM premium_plans WHERE id=$1", [plan_id])).rows[0];
  assert(p, 404, "Plan not found");
  assert(p.price === 0, 409, "Paid plan billing is not configured. Contact RACAN for access.");
  await db.query("INSERT INTO subscriptions(user_id,plan_id) VALUES($1,$2) ON CONFLICT(user_id) DO UPDATE SET plan_id=$2,status='active'", [req.user.id, plan_id]);
  res.json({ ok: true });
});
management.get("/admin", role("ADMIN"), async (_req, res) => {
  const result = {};
  for (const table of ["brands", "products", "reels", "advertisements", "orders", "payments", "premium_plans", "categories", "posts", "reviews", "reports", "settings"]) result[table] = (await db.query(`SELECT * FROM ${table} LIMIT 200`)).rows;
  result.users = (await db.query("SELECT id,name,email,role,disabled,created_at FROM users")).rows;
  res.json(result);
});
management.put("/admin/moderate", role("ADMIN"), async (req, res) => {
  const v = z5.object({ entity: z5.enum(["brands", "products", "reels", "reports"]), id: z5.string(), status: z5.string() }).parse(req.body);
  const states = { brands: ["approved", "rejected"], products: ["published", "rejected"], reels: ["published", "rejected"], reports: ["resolved", "dismissed"] }[v.entity];
  assert(states.includes(v.status), 400, "Invalid status");
  await db.query(`UPDATE ${v.entity} SET status=$1 ${v.entity === "brands" ? ",verified=($1='approved')" : ""} WHERE id=$2`, [v.status, v.id]);
  res.json({ ok: true });
});
management.put("/admin/users/:id", role("ADMIN"), async (req, res) => {
  const { disabled } = z5.object({ disabled: z5.boolean() }).parse(req.body);
  assert(req.params.id !== req.user.id, 400, "You cannot disable your own account");
  await db.query("UPDATE users SET disabled=$1 WHERE id=$2", [disabled, req.params.id]);
  res.json({ ok: true });
});
management.put("/admin/plans/:id", role("ADMIN"), async (req, res) => {
  const v = z5.object({ price: z5.number().int().min(0).nullable(), product_limit: z5.number().int().min(1), reel_limit: z5.number().int().min(1) }).parse(req.body);
  await db.query("UPDATE premium_plans SET price=$1,product_limit=$2,reel_limit=$3 WHERE id=$4", [v.price, v.product_limit, v.reel_limit, req.params.id]);
  res.json({ ok: true });
});
management.post("/admin/advertisements", role("ADMIN"), async (req, res) => {
  const v = z5.object({ title: z5.string().min(3).max(150), description: z5.string().max(500), image: safeURL, video: safeURL.optional(), target_url: safeURL, brand_id: z5.string().nullable().optional(), placement: z5.enum(["Landing Top", "Landing Middle", "Gen Z", "Women", "Reels", "Other"]), status: z5.enum(["Draft", "Active", "Expired", "Disabled"]), start_date: z5.string().datetime().nullable(), end_date: z5.string().datetime().nullable() }).refine((v2) => !v2.start_date || !v2.end_date || v2.end_date > v2.start_date, "End date must follow start date").parse(req.body);
  await db.query("INSERT INTO advertisements(id,title,description,image,video,target_url,brand_id,placement,status,start_date,end_date) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)", [randomUUID6(), v.title, v.description, v.image, v.video, v.target_url, v.brand_id, v.placement, v.status, v.start_date, v.end_date]);
  res.status(201).json({ ok: true });
});
management.put("/admin/advertisements/:id", role("ADMIN"), async (req, res) => {
  const { status } = z5.object({ status: z5.enum(["Draft", "Active", "Expired", "Disabled"]) }).parse(req.body);
  await db.query("UPDATE advertisements SET status=$1 WHERE id=$2", [status, req.params.id]);
  res.json({ ok: true });
});
management.post("/admin/categories", role("ADMIN"), async (req, res) => {
  const { name } = z5.object({ name: z5.string().min(2).max(50) }).parse(req.body);
  await db.query("INSERT INTO categories VALUES($1) ON CONFLICT DO NOTHING", [name]);
  res.status(201).json({ ok: true });
});
management.put("/admin/orders/:id", role("ADMIN"), async (req, res) => {
  const { status } = z5.object({ status: z5.enum(["Processing", "Shipped", "Delivered"]) }).parse(req.body);
  const previous = { Processing: "Confirmed", Shipped: "Processing", Delivered: "Shipped" }[status];
  const changed = await db.query("UPDATE orders SET status=$1 WHERE id=$2 AND status=$3 RETURNING id", [status, req.params.id, previous]);
  assert(changed.rows.length, 409, "This order cannot move to that status");
  res.json({ ok: true });
});
management.put("/admin/settings", role("ADMIN"), async (req, res) => {
  const v = z5.object({ shipping: z5.number().int().min(0).max(1e4), freeShippingThreshold: z5.number().int().min(0).max(1e6) }).parse(req.body);
  await db.query("UPDATE settings SET value=$1 WHERE key='platform'", [JSON.stringify({ name: "RACAN", ...v })]);
  res.json({ ok: true });
});

// server/lib/seo.ts
init_db();
import { readFile } from "node:fs/promises";
import path2 from "node:path";
var escape = (value) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
var publicPage = async (req, res, next) => {
  try {
    const isProduct = req.path.startsWith("/product/");
    const row = (await db.query(isProduct ? "SELECT p.*,b.name AS brand_name FROM products p JOIN brands b ON b.id=p.brand_id WHERE p.id=$1 AND p.status='published' AND p.deleted_at IS NULL AND b.status='approved'" : "SELECT * FROM brands WHERE id=$1 AND status='approved' AND deleted_at IS NULL", [req.params.id])).rows[0];
    if (!row) return res.status(404).send("This discovery is no longer available.");
    let html = await readFile(path2.resolve("dist/index.html"), "utf8");
    const title = escape(`${row.name} \u2014 RACAN`), description = escape(row.description.slice(0, 250));
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`).replace(/<meta name="description" content="[^"]*"\s*\/?\s*>/, `<meta name="description" content="${description}"/>`).replace(/<meta property="og:title" content="[^"]*"\s*\/?\s*>/, `<meta property="og:title" content="${title}"/>`).replace(/<meta property="og:description" content="[^"]*"\s*\/?\s*>/, `<meta property="og:description" content="${description}"/>`);
    const origin = process.env.APP_ORIGIN || "http://localhost:3000";
    const canonical = escape(origin + req.path);
    html = html.replace("</head>", `<link rel="canonical" href="${canonical}"/><meta property="og:url" content="${canonical}"/>${row.image ? `<meta property="og:image" content="${escape(origin + row.image)}"/>` : ""}</head>`);
    res.type("html").send(html);
  } catch (e) {
    next(e);
  }
};

// server/index.ts
if (process.env.VERCEL) {
  if (process.env.DATABASE_URL) await (await Promise.resolve().then(() => (init_db(), db_exports))).migrate();
  else {
    process.env.SEED_PASSWORD = process.env.SEED_PASSWORD || "racan-vercel-demo-password";
    await seed();
  }
} else {
  await seed();
}
var app = express();
app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], imgSrc: ["'self'", "data:"], mediaSrc: ["'self'", "https:"], styleSrc: ["'self'", "'unsafe-inline'"], scriptSrc: ["'self'"], connectSrc: ["'self'"], fontSrc: ["'self'"], upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null } } }));
app.use(cookieParser());
app.use("/api", rateLimit2({ windowMs: 6e4, limit: 300, standardHeaders: "draft-7", legacyHeaders: false }));
app.use("/api", (req, res, next) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    const origin = req.get("origin");
    const allowed = process.env.NODE_ENV === "production" ? [process.env.APP_ORIGIN] : ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"];
    if (origin && !allowed.includes(origin)) return res.status(403).json({ error: "Request origin is not permitted" });
    if (!req.is("application/json")) return res.status(415).json({ error: "JSON requests are required" });
  }
  next();
});
app.use("/api", identify);
app.use("/api/upload", role("SELLER", "ADMIN"), express.json({ limit: "36mb" }));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", async (_req, res) => {
  await db.query("SELECT 1");
  res.json({ status: "ok", mode: process.env.NODE_ENV === "production" ? "production" : "development" });
});
app.get("/api/config", async (_req, res) => res.json({ development: process.env.NODE_ENV !== "production", paymentMode: process.env.PAYMENT_PROVIDER || "development", ...(await db.query("SELECT value FROM settings WHERE key='platform'")).rows[0].value }));
app.get("/api/media/:id", async (req, res) => {
  const file = await storage.get(req.params.id);
  if (!file) return res.status(404).end();
  res.set("Cache-Control", "public,max-age=86400").set("Accept-Ranges", "bytes").type(file.mime);
  const range = req.get("range");
  if (range) {
    const match = /^bytes=(\d+)-(\d*)$/.exec(range);
    if (!match) return res.status(416).set("Content-Range", `bytes */${file.data.length}`).end();
    const start = Number(match[1]), end = match[2] ? Math.min(Number(match[2]), file.data.length - 1) : file.data.length - 1;
    if (start > end || start >= file.data.length) return res.status(416).set("Content-Range", `bytes */${file.data.length}`).end();
    res.status(206).set("Content-Range", `bytes ${start}-${end}/${file.data.length}`).send(file.data.subarray(start, end + 1));
  } else res.send(file.data);
});
app.use("/api/auth", auth);
app.use("/api", catalog);
app.use("/api", management);
app.use("/api", social);
app.use("/api", commerce);
app.use("/api", (_req, res) => res.status(404).json({ error: "Endpoint not found" }));
app.get("/sitemap.xml", async (_req, res) => {
  const origin = (process.env.APP_ORIGIN || "http://localhost:3000").replace(/\/$/, "");
  const urls = ["/", "/gen-z", "/women", "/brands", ...(await db.query("SELECT id FROM products WHERE status='published' AND deleted_at IS NULL")).rows.map((p) => `/product/${p.id}`), ...(await db.query("SELECT id FROM brands WHERE status='approved' AND deleted_at IS NULL")).rows.map((b) => `/brand/${b.id}`)];
  res.type("xml").send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${origin}${u}</loc></url>`).join("")}</urlset>`);
});
app.use(express.static(path3.resolve("dist")));
app.get("/product/:id", publicPage);
app.get("/brand/:id", publicPage);
app.get("/{*path}", (_req, res) => res.sendFile(path3.resolve("dist/index.html")));
app.use((err, _req, res, _next) => {
  if (err instanceof ZodError) return res.status(400).json({ error: err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") });
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  if (err.code === "23505") return res.status(409).json({ error: "This record already exists" });
  if (err.code === "23503") return res.status(400).json({ error: "The referenced item does not exist" });
  console.error(err);
  res.status(err.status === 413 ? 413 : 500).json({ error: err.status === 413 ? "Upload is too large" : "Something went wrong. Please try again." });
});
if (!process.env.VERCEL) app.listen(Number(process.env.PORT || 3001), "127.0.0.1", () => console.log(`RACAN API ready at http://127.0.0.1:${process.env.PORT || 3001}`));
var server_default = app;

// api/handler.ts
var handler_default = server_default;
export {
  handler_default as default
};

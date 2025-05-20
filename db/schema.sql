-- db/schema.sql
CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  root_email_address TEXT NOT NULL UNIQUE,
  image_url TEXT DEFAULT NULL,
  credit_remaining INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_suspended BOOLEAN DEFAULT FALSE,
  notes TEXT DEFAULT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_deleted TIMESTAMP DEFAULT NULL
);


CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  email_address TEXT NOT NULL UNIQUE,
  credit INTEGER DEFAULT 0,
  name TEXT DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_suspended BOOLEAN DEFAULT FALSE,
  access_level TEXT DEFAULT 'user' CHECK(access_level IN ('super', 'admin', 'user')),
  notes TEXT DEFAULT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_deleted TIMESTAMP DEFAULT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);
CREATE INDEX IF NOT EXISTS idx_users_email_address ON users(email_address);

CREATE TABLE IF NOT EXISTS plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  credit INTEGER NOT NULL DEFAULT 0,
  price INTEGER NOT NULL,
  interval TEXT NOT NULL DEFAULT 'monthly' CHECK(interval IN ('monthly', 'one-off', 'trial')),
  is_active BOOLEAN DEFAULT TRUE,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_deleted TIMESTAMP DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_plans_name ON plans(name);

CREATE TABLE IF NOT EXISTS queries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  query TEXT NOT NULL,
  result TEXT NOT NULL,
  credit_cost INTEGER NOT NULL DEFAULT 1,
  status TEXT DEFAULT 'pending' CHECK(status IN ('draft', 'pending', 'processing', 'completed', 'failed', 'abandoned')),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_deleted TIMESTAMP DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_queries_status ON queries(status);
CREATE INDEX IF NOT EXISTS idx_queries_user_id ON queries(user_id);


CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  plan_id INTEGER NOT NULL,
  status TEXT DEFAULT 'in-basket' CHECK(status IN ('in-basket','failed', 'abandoned','placed', 'cancelled')),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_deleted TIMESTAMP DEFAULT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);



CREATE TABLE IF NOT EXISTS payment_methods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  nickname TEXT NOT NULL,
  payment_supplier_client_id TEXT NOT NULL UNIQUE,
  payment_supplier TEXT NOT NULL CHECK(payment_supplier IN ('stripe', 'paypal')),
  is_current BOOLEAN DEFAULT FALSE,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_deleted TIMESTAMP DEFAULT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
);


CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  payment_method_id INTEGER NOT NULL,
  charged_amount INTEGER NOT NULL DEFAULT 0,
  order_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('succeeded','failed','pending')),
  attempt_count INTEGER DEFAULT 1,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  interval_start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  interval_end_date TIMESTAMP NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (payment_methods_id) REFERENCES payment_methods(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS auth (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email_address TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT TRUE,
  otp_secret TEXT DEFAULT NULL,
  otp_enabled TEXT DEFAULT NULL,
  history TEXT DEFAULT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (email_address) REFERENCES users(email_address) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_auth_email_address ON auth(email_address);
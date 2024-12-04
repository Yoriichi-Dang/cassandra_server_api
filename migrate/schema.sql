-- Creating the users_account table
CREATE TABLE "users_account" (
  "id" SERIAL PRIMARY KEY 	,
  "full_name" varchar,  -- Corrected to 'varchar'
  "username" varchar,   -- Corrected to 'varchar'
  "avatar_url" varchar, -- Corrected to 'varchar'
  "address" varchar,    -- Corrected to 'varchar'
  "district" varchar,   -- Corrected to 'varchar'
  "province" varchar,   -- Corrected to 'varchar'
  "day_of_birth" timestamp,
  "gender" varchar(6),  -- Corrected to 'varchar(6)'
  "description" varchar, -- Corrected to 'varchar'
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

-- Creating the users_login_data table
CREATE TABLE "users_login_data" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "phone" varchar UNIQUE,      -- Corrected to 'varchar'
  "email" varchar NOT NULL,    -- Corrected to 'varchar'
  "password_hash" varchar NOT NULL,  -- Corrected to 'varchar'
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp
);

-- Adding foreign key constraint
ALTER TABLE "users_account" ADD CONSTRAINT fk_users_account_login
    FOREIGN KEY ("id") REFERENCES "users_login_data" ("id");

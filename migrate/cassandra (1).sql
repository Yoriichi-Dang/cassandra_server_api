-- 1. Create "users_account" table
CREATE TABLE "users_account" (
  "id" SERIAL PRIMARY KEY,
  "full_name" VARCHAR,
  "username" VARCHAR UNIQUE NOT NULL,
  "avatar_url" VARCHAR,
  "address" VARCHAR,
  "district" VARCHAR,
  "province" VARCHAR,
  "day_of_birth" DATE,
  "gender" VARCHAR(6),
  "description" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP
);

-- 2. Create "users_login_data" table
CREATE TABLE "users_login_data" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER UNIQUE NOT NULL, -- Each user has one login data entry
  "phone" VARCHAR UNIQUE,
  "email" VARCHAR UNIQUE NOT NULL,
  "password_hash" VARCHAR NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP,
  CONSTRAINT fk_users_login_user_id FOREIGN KEY ("user_id") 
    REFERENCES "users_account" ("id") ON DELETE CASCADE
);

-- 3. Create "user_follows" table
CREATE TABLE "user_follows" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "user_following_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP,
  CONSTRAINT fk_user_follows_user_id FOREIGN KEY ("user_id") 
    REFERENCES "users_account" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_user_follows_user_following_id FOREIGN KEY ("user_following_id") 
    REFERENCES "users_account" ("id") ON DELETE CASCADE,
  CONSTRAINT unique_user_follow UNIQUE ("user_id", "user_following_id"),
  CONSTRAINT chk_no_self_follow CHECK ("user_id" <> "user_following_id")
);

-- 4. Create "posts" table
CREATE TABLE "posts" (
  "id" SERIAL PRIMARY KEY,
  "content" TEXT,
  "image_url" VARCHAR,
  "caption" VARCHAR,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP
);

-- 5. Create "user_posts" table
CREATE TABLE "user_posts" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "post_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP,
  CONSTRAINT fk_user_posts_user_id FOREIGN KEY ("user_id") 
    REFERENCES "users_account" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_user_posts_post_id FOREIGN KEY ("post_id") 
    REFERENCES "posts" ("id") ON DELETE CASCADE,
  CONSTRAINT unique_user_post UNIQUE ("user_id", "post_id")
);

-- 6. Create "stories" table
CREATE TABLE "stories" (
  "id" SERIAL PRIMARY KEY,
  "caption" VARCHAR,
  "image_url" VARCHAR,
  "time_end" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP
);

-- 7. Create "user_stories" table
CREATE TABLE "user_stories" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL,
  "story_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP,
  CONSTRAINT fk_user_stories_user_id FOREIGN KEY ("user_id") 
    REFERENCES "users_account" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_user_stories_story_id FOREIGN KEY ("story_id") 
    REFERENCES "stories" ("id") ON DELETE CASCADE,
  CONSTRAINT unique_user_story UNIQUE ("user_id", "story_id")
);

-- 8. Create "users_interact_story" table
CREATE TABLE "users_interact_story" (
  "id" SERIAL PRIMARY KEY,
  "story_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP,
  CONSTRAINT fk_users_interact_story_story_id FOREIGN KEY ("story_id") 
    REFERENCES "stories" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_users_interact_story_user_id FOREIGN KEY ("user_id") 
    REFERENCES "users_account" ("id") ON DELETE CASCADE,
  CONSTRAINT unique_user_interact_story UNIQUE ("story_id", "user_id")
);

-- 9. Create "users_interact_post" table
CREATE TABLE "users_interact_post" (
  "id" SERIAL PRIMARY KEY,
  "post_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP,
  CONSTRAINT fk_users_interact_post_post_id FOREIGN KEY ("post_id") 
    REFERENCES "posts" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_users_interact_post_user_id FOREIGN KEY ("user_id") 
    REFERENCES "users_account" ("id") ON DELETE CASCADE,
  CONSTRAINT unique_user_interact_post UNIQUE ("post_id", "user_id")
);

-- 10. Create "user_post_comments" table
CREATE TABLE "user_post_comments" (
  "id" SERIAL PRIMARY KEY,
  "post_id" INTEGER NOT NULL,
  "user_comment_id" INTEGER NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP,
  CONSTRAINT fk_user_post_comments_post_id FOREIGN KEY ("post_id") 
    REFERENCES "posts" ("id") ON DELETE CASCADE,
  CONSTRAINT fk_user_post_comments_user_comment_id FOREIGN KEY ("user_comment_id") 
    REFERENCES "users_account" ("id") ON DELETE CASCADE
);

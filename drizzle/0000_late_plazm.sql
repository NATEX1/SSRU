CREATE TABLE `article_tags` (
	`article_id` int NOT NULL,
	`tag_id` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category_id` int NOT NULL,
	`author_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`content` text NOT NULL,
	`thumbnail` varchar(255),
	`status` varchar(20) DEFAULT 'draft',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `articles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255),
	`message` text NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	CONSTRAINT `tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` varchar(20) DEFAULT 'author',
	`position` varchar(50),
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `article_tags` ADD CONSTRAINT `article_tags_article_id_articles_id_fk` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `article_tags` ADD CONSTRAINT `article_tags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE no action ON UPDATE no action;
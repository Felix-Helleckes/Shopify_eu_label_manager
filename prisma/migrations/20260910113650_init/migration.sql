-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" DATETIME,
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" DATETIME
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domain" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "primaryDomain" TEXT,
    "currency" TEXT,
    "shopLocale" TEXT,
    "installedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uninstalledAt" DATETIME,
    "plan" TEXT,
    "notifyMerchant" BOOLEAN NOT NULL DEFAULT true,
    "merchantEmail" TEXT,
    "replyToEmail" TEXT,
    "tagOrders" BOOLEAN NOT NULL DEFAULT true,
    "orderTag" TEXT NOT NULL DEFAULT 'EU-Widerruf',
    "ackLanguageMode" TEXT NOT NULL DEFAULT 'storefront',
    "extraAckText" TEXT,
    "guaranteeNoticeEnabled" BOOLEAN NOT NULL DEFAULT true,
    "durabilityLabelEnabled" BOOLEAN NOT NULL DEFAULT true,
    "repairInfoEnabled" BOOLEAN NOT NULL DEFAULT false,
    "repairInfoText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Withdrawal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "receiptNo" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'de',
    "consumerName" TEXT NOT NULL,
    "contractRef" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "orderDate" TEXT,
    "details" TEXT,
    "orderId" TEXT,
    "orderName" TEXT,
    "orderMatched" BOOLEAN NOT NULL DEFAULT false,
    "orderEmailMatched" BOOLEAN,
    "orderCreatedAt" DATETIME,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentHash" TEXT NOT NULL,
    "ackSentAt" DATETIME,
    "ackError" TEXT,
    "merchantNotifiedAt" DATETIME,
    "orderTaggedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'received',
    "merchantNote" TEXT,
    "anonymizedAt" DATETIME,
    "userAgent" TEXT,
    "ipHash" TEXT
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Session_shop_idx" ON "Session"("shop");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_domain_key" ON "Shop"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "Withdrawal_receiptNo_key" ON "Withdrawal"("receiptNo");

-- CreateIndex
CREATE INDEX "Withdrawal_shop_submittedAt_idx" ON "Withdrawal"("shop", "submittedAt");

-- CreateIndex
CREATE INDEX "Withdrawal_shop_contactEmail_idx" ON "Withdrawal"("shop", "contactEmail");

-- CreateIndex
CREATE INDEX "Withdrawal_shop_status_idx" ON "Withdrawal"("shop", "status");

-- CreateIndex
CREATE INDEX "AuditEvent_shop_createdAt_idx" ON "AuditEvent"("shop", "createdAt");

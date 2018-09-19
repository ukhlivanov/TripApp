"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL || 'mongodb://localhost/trip';
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/test-trip";
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'soccer';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '30d';
"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL || 'mongodb://localhost/trip';
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/test-trip";
exports.PORT = process.env.PORT || 8080;
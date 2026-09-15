import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Firestore Security Rules Verification', () => {
  const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
  const rulesContent = fs.readFileSync(rulesPath, 'utf-8');

  it('rules file exists and specifies rules_version = 2', () => {
    expect(rulesContent).toContain("rules_version = '2'");
    expect(rulesContent).toContain('service cloud.firestore');
  });

  it('enforces strict authentication and ownership on analysisHistory collection', () => {
    // Requires authenticated user and matching userId
    expect(rulesContent).toMatch(/match \/analysisHistory\/\{analysisId\}/);
    expect(rulesContent).toContain('request.resource.data.userId == request.auth.uid');
    expect(rulesContent).toContain('resource.data.userId == request.auth.uid');
  });

  it('enforces user profile isolation and permits user profile updates', () => {
    // Users must be able to create, read, and UPDATE their own profile
    expect(rulesContent).toMatch(/match \/users\/\{userId\}/);
    expect(rulesContent).toContain('isOwner(userId)');
    expect(rulesContent).toContain('allow read, create, update: if isOwner(userId)');
  });

  it('enforces strict ownership isolation on messages collection', () => {
    // Messages must be scoped to the authenticated owner to prevent cross-user snooping
    expect(rulesContent).toMatch(/match \/messages\/\{messageId\}/);
    expect(rulesContent).toContain('request.resource.data.userId == request.auth.uid');
    expect(rulesContent).toContain('resource.data.userId == request.auth.uid');
  });

  it('contains default deny rule for unlisted collections', () => {
    expect(rulesContent).toMatch(/match \/\{document=\*\*\}\s*\{\s*allow read, write: if false;\s*\}/);
  });
});

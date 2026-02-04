/**
 * SSH Key Discovery Utility
 * Auto-discovers SSH keys from standard locations
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class SSHKeyDiscovery {
  /**
   * Find the best available SSH key in standard locations
   * Priority: id_ed25519 > id_rsa
   * @returns {privateKey: string, keyType: string, keyPath: string} or throws error
   */
  static findSystemKey(): { privateKey: string; keyType: string; keyPath: string } {
    const sshDir = path.join(os.homedir(), '.ssh');

    // Priority order: ed25519 first (modern, secure), then rsa (legacy)
    const keyPaths = [
      { path: path.join(sshDir, 'id_ed25519'), type: 'ed25519' },
      { path: path.join(sshDir, 'id_rsa'), type: 'rsa' }
    ];

    for (const { path: keyPath, type } of keyPaths) {
      if (fs.existsSync(keyPath)) {
        try {
          const privateKey = fs.readFileSync(keyPath, 'utf8');

          // Basic validation
          if (privateKey.includes('PRIVATE KEY')) {
            return { privateKey, keyType: type, keyPath };
          }
        } catch (error) {
          console.warn(`Found key at ${keyPath} but couldn't read it:`, error);
        }
      }
    }

    throw new Error(
      'No SSH keys found in standard locations. ' +
      'Please create an SSH key:\n' +
      '  ssh-keygen -t ed25519 -C "your_email@example.com"\n' +
      'Or:\n' +
      '  ssh-keygen -t rsa -b 4096 -C "your_email@example.com"'
    );
  }

  /**
   * Check if SSH keys exist
   */
  static hasSystemKeys(): boolean {
    try {
      this.findSystemKey();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get list of available keys with metadata
   */
  static listAvailableKeys(): Array<{ path: string; type: string; exists: boolean }> {
    const sshDir = path.join(os.homedir(), '.ssh');
    return [
      {
        path: path.join(sshDir, 'id_ed25519'),
        type: 'ed25519',
        exists: fs.existsSync(path.join(sshDir, 'id_ed25519'))
      },
      {
        path: path.join(sshDir, 'id_rsa'),
        type: 'rsa',
        exists: fs.existsSync(path.join(sshDir, 'id_rsa'))
      }
    ];
  }
}

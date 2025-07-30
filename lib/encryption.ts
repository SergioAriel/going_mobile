import * as Crypto from 'expo-crypto';
import { AddressForm, EncryptedData } from '@/interfaces';

const algorithm = Crypto.CryptoDigestAlgorithm.SHA256;

// In a real app, you should securely manage this key.
// It should be a string of a reasonable length.
const secretKey = process.env.ENCRYPTION_KEY;

if (!secretKey) {
  throw new Error('ENCRYPTION_KEY is not defined in the environment variables');
}

// Helper function to derive a key of a specific length (32 bytes for AES-256)
async function deriveKey(password: string, salt: string): Promise<Uint8Array> {
    const passwordBuffer = new TextEncoder().encode(password);
    const saltBuffer = new TextEncoder().encode(salt);
    const combinedBuffer = new Uint8Array(passwordBuffer.length + saltBuffer.length);
    combinedBuffer.set(passwordBuffer, 0);
    combinedBuffer.set(saltBuffer, passwordBuffer.length);

    const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        new TextDecoder().decode(combinedBuffer),
        { encoding: Crypto.CryptoEncoding.HEX }
    );

    // Use the first 32 bytes (256 bits) of the hash as the key
    return new TextEncoder().encode(digest.slice(0, 32));
}


export async function encryptObject(obj: AddressForm): Promise<EncryptedData> {
  try {
    const text = JSON.stringify(obj);
    const iv = await Crypto.getRandomBytesAsync(12);
    const ivString = btoa(String.fromCharCode.apply(null, Array.from(iv))); // Base64 encode IV

    // In a real scenario, the salt should be unique per encryption and stored
    const salt = "static-salt-for-now"; // Replace with a dynamic, stored salt in production
    const key = await deriveKey(secretKey, salt);

    const encrypted = await Crypto.encryptAsync(
        'AES-GCM',
        key,
        {
            iv: iv,
            data: new TextEncoder().encode(text),
            additionalData: undefined, // Not used here
            tagLength: 128, // Standard for GCM
        }
    );

    const content = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(encrypted))));

    // The tag is appended to the ciphertext by encryptAsync in AES-GCM mode
    // We don't get it separately. We will slice it off during decryption.
    return {
      iv: ivString,
      content: content,
      tag: '' // Tag is included in content for AES-GCM with expo-crypto
    };
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Could not encrypt the data.");
  }
}

export async function decryptObject(encryptedData: EncryptedData): Promise<AddressForm> {
    try {
        const iv = new Uint8Array(atob(encryptedData.iv).split('').map(char => char.charCodeAt(0)));
        const encryptedBuffer = new Uint8Array(atob(encryptedData.content).split('').map(char => char.charCodeAt(0)));

        // In a real scenario, the salt should be the one stored during encryption
        const salt = "static-salt-for-now";
        const key = await deriveKey(secretKey, salt);

        const decrypted = await Crypto.decryptAsync(
            'AES-GCM',
            key,
            {
                iv: iv,
                data: encryptedBuffer,
                additionalData: undefined,
                tagLength: 128,
            }
        );

        const decryptedText = new TextDecoder().decode(decrypted);
        return JSON.parse(decryptedText) as AddressForm;
    } catch (error) {
        console.error("Decryption failed:", error);
        throw new Error("Could not decrypt the data.");
    }
}
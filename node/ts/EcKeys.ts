//
// Copyright 2020-2022 Signal Messenger, LLC.
// SPDX-License-Identifier: AGPL-3.0-only
//

import * as Native from '../Native';

export class PublicKey {
  readonly _nativeHandle: Native.PublicKey;

  private constructor(handle: Native.PublicKey) {
    this._nativeHandle = handle;
  }

  static _fromNativeHandle(handle: Native.PublicKey): PublicKey {
    return new PublicKey(handle);
  }

  static deserialize(buf: Uint8Array): PublicKey {
    return new PublicKey(Native.PublicKey_Deserialize(buf));
  }

  /// Returns -1, 0, or 1
  compare(other: PublicKey): number {
    return Native.PublicKey_Compare(this, other);
  }

  serialize(): Uint8Array {
    return Native.PublicKey_Serialize(this);
  }

  getPublicKeyBytes(): Uint8Array {
    return Native.PublicKey_GetPublicKeyBytes(this);
  }

  verify(msg: Uint8Array, sig: Uint8Array): boolean {
    return Native.PublicKey_Verify(this, msg, sig);
  }

  verifyAlternateIdentity(other: PublicKey, signature: Uint8Array): boolean {
    return Native.IdentityKey_VerifyAlternateIdentity(this, other, signature);
  }
}

export class PrivateKey {
  readonly _nativeHandle: Native.PrivateKey;

  private constructor(handle: Native.PrivateKey) {
    this._nativeHandle = handle;
  }

  static _fromNativeHandle(handle: Native.PrivateKey): PrivateKey {
    return new PrivateKey(handle);
  }

  static generate(): PrivateKey {
    return new PrivateKey(Native.PrivateKey_Generate());
  }

  static deserialize(buf: Uint8Array): PrivateKey {
    return new PrivateKey(Native.PrivateKey_Deserialize(buf));
  }

  serialize(): Uint8Array {
    return Native.PrivateKey_Serialize(this);
  }

  sign(msg: Uint8Array): Uint8Array {
    return Native.PrivateKey_Sign(this, msg);
  }

  agree(other_key: PublicKey): Uint8Array {
    return Native.PrivateKey_Agree(this, other_key);
  }

  getPublicKey(): PublicKey {
    return PublicKey._fromNativeHandle(Native.PrivateKey_GetPublicKey(this));
  }
}

export class IdentityKeyPair {
  readonly publicKey: PublicKey;
  readonly privateKey: PrivateKey;

  constructor(publicKey: PublicKey, privateKey: PrivateKey) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  static generate(): IdentityKeyPair {
    const privateKey = PrivateKey.generate();
    return new IdentityKeyPair(privateKey.getPublicKey(), privateKey);
  }

  static deserialize(buffer: Uint8Array): IdentityKeyPair {
    const { privateKey, publicKey } =
      Native.IdentityKeyPair_Deserialize(buffer);
    return new IdentityKeyPair(
      PublicKey._fromNativeHandle(publicKey),
      PrivateKey._fromNativeHandle(privateKey)
    );
  }

  serialize(): Uint8Array {
    return Native.IdentityKeyPair_Serialize(this.publicKey, this.privateKey);
  }

  signAlternateIdentity(other: PublicKey): Uint8Array {
    return Native.IdentityKeyPair_SignAlternateIdentity(
      this.publicKey,
      this.privateKey,
      other
    );
  }
}

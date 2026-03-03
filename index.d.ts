/**
 * chrome-webstore-upload-cli - CLI tool to upload Chrome Extensions to the Chrome Web Store
 */

export interface ChromeWebStoreConfig {
    extensionId?: string;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
}

export interface ConfigResult {
    apiConfig: ChromeWebStoreConfig;
    path?: string;
    isUpload: boolean;
    isPublish: boolean;
    autoPublish: boolean;
    trustedTesters?: boolean;
    deployPercentage?: number;
    maxAwaitInProgress?: number;
}

export interface UploadOptions {
    apiConfig: ChromeWebStoreConfig;
    path: string;
    token?: string;
    maxAwaitInProgress?: number;
}

export interface PublishOptions {
    apiConfig: ChromeWebStoreConfig;
    token?: string;
}

export default function getConfig(
    command?: string,
    flags?: Record<string, unknown>
): Promise<ConfigResult>;

export function upload(options: UploadOptions): Promise<unknown>;

export function publish(
    options: PublishOptions,
    publishTarget?: string,
    deployPercentage?: number
): Promise<unknown>;

export function fetchToken(apiConfig: ChromeWebStoreConfig): Promise<unknown>;

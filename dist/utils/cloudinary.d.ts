export declare function uploadPdfToCloudinary(filePath: string): Promise<{
    secure_url: any;
    public_id: any;
}>;
export declare function uploadPdfBufferToCloudinary(buffer: Buffer, filename: string): Promise<{
    secure_url: string;
    public_id: string;
}>;
export declare const deleteFromCloudinary: (imageUrl: string) => Promise<void>;

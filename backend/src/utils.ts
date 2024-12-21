export const responseMessage = (code: number | undefined, message: string) => {
    return {status: code, message: message};
};

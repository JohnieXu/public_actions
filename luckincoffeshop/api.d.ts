declare enum Ret {
    success = '1',
    fail = '0'
}

export interface Icheckin {
    ({ domain, accessToken }: {
        domain: string,
        accessToken: string,
    }): Promise<string>
}
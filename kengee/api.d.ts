declare enum Ret {
    success = '1',
    fail = '0'
}

export interface Icheckin {
    ({ domain, cookie, token }: {
        domain: string,
        cookie: string,
        token: string,
    }): Promise<string>
}

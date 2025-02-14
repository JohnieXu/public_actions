declare enum Ret {
  success = '1',
  fail = '0'
}

export interface Icheckin {
  ({ domain, cookie }: {
    domain: string,
    cookie: string
  }): Promise<string>
}
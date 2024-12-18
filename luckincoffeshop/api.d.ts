declare enum Ret {
    success = '1',
    fail = '0'
}

declare enum TotalEmailType {
    success = 0,
    fail = 1,
}

export interface LuckinCoffeShopTask {
    taskId: number
    title: string
    taskNum: number
    taskType: number
    isOrNot: number // 2: 还未参与 1：已参与
    appTitle: string
    score: number
    numberOfDraws: number
    numberOfResignings: number
    lotteryActivityId: string
}

export interface Icheckin {
    ({ domain, accessToken }: {
        domain: string,
        accessToken: string,
    }): Promise<string>
}

export interface Ilottery {
    ({ domain, accessToken }: {
        domain: string,
        accessToken: string,
    }): Promise<string>
}

export interface IgetTaskList {
    ({ domain, accessToken }: {
        domain: string,
        accessToken: string,
    }): Promise<LuckinCoffeShopTask[]>
}

export interface IsendtotalEmail {
    (data: {
        type: string,
        result: TotalEmailType,
        msg: string
    }[]): Promise<void>
}

export interface PageInfo {
    pagePath: string;
    callback: () => void;
}

export class Router {
    pages: PageInfo[];

    constructor(pages: PageInfo[]) {
        this.pages = pages;
    }

    navigate(path: string) {
        const userInfo: string | null = localStorage.getItem('user');
        if (userInfo) {
            const pageInfo: PageInfo | undefined = this.pages.find((item) => item.pagePath === path);
            if (pageInfo) {
                pageInfo.callback();
                return;
            }
            this.pages.find((item) => item.pagePath === 'start')?.callback();
            return;
        }
        this.pages.find((item) => item.pagePath === 'login')?.callback();
    }
}

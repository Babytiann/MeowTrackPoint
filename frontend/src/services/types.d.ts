declare interface TableData {
    demoData?: Array<{ uuid: string; create_at: string; event: string; event_data: string; page_url: string }>;
    errorData?: unknown;
    timingData?: Array<{ uuid: string; create_at: string; event: string; page_url: string; FP: number; DCL: number; L: number }>;
    baseInfoData?: Array<{ uuid: string; create_at: string; browser: string; os: string; referrer: string; }>;
}

declare interface SeriesData {
    name: string;
    type: 'line';
    data: number[];
}

declare type DateRange = 'today' | 'week' | 'month' | 'year';

declare type query = {
    uuid?: string | null;
    event?: string;
    event_data?: string | null;
    time?: PerformanceEntry[];
    message?: string;
    stack?: string | null;
    type?: string;
    page_url?: string;
    FP?: number;
    DCL?: number;
    L?: number;
    os?: string;
    browser?: string;
    referrer?: string;
}

declare interface CardProps {
    readonly event: string;
    buttonClick(event: string): void;
}

declare interface TrackPointProps {
    events: string[];
    setEvents: React.Dispatch<React.SetStateAction<string[]>>;
    pointList: string[];
    setPointList: React.Dispatch<React.SetStateAction<string[]>>;
    nowEvent: string | null;
    setNowEvent: React.Dispatch<React.SetStateAction<string | null>>;
}

declare interface HomeProps {
    readonly events: string[];
}

declare interface UserData {
    uuid: string;
    browser: string;
    os: string;
}

declare interface ErrorData {
    uuid: string;
    message: string;
    stack: string;
    type: string;
    page_url: string;
    create_at: string;
}

declare interface HeaderProps {
    toggleMode(): void;
    brightMode: boolean;
}

declare interface DemoData {
    uuid: string;
    create_at: string;
    event: string;
}
export class Store<T> {
    private state!: T;
    private getters!: GetterMap<T>;
    private mutations!: MutationMap<T>;

    private subscribers!: SubscriberMap;

    public constructor(options: StoreOptions<T>) {
        this.state = options.state;

        this.getters = {};
        Object.keys(options.getters).forEach((key) => {
            this.getters[key] = options.getters[key];
        });

        this.mutations = {};
        Object.keys(options.mutations).forEach((key) => {
            this.mutations[key] = options.mutations[key];
        });

        this.subscribers = {};
    }

    public mutate<T>(key: string, payload: T): any {
        this.mutations[key](this.state, payload);
        this.__internalNotifier(key, payload);
    }

    public get<T>(key: string): T {
        this.__internalNotifier(key);
        return this.getters[key](this.state) as T;
    }

    public subscribe(key: string, subscriber: Subscriber): void {
        this.subscribers[key] = this.subscribers[key] || [];
        this.subscribers[key].push(subscriber);
    }

    private __internalNotifier(key: string, data?: any): void {
        const subscribers = this.subscribers[key];
        if (subscribers != undefined && subscribers.length > 0) {
            subscribers.forEach((subscriber) => {
                subscriber(data);
            });
        }
    }
}

export interface StoreOptions<T> {
    state: T;
    getters: GetterMap<T>;
    mutations: MutationMap<T>;
}

export interface GetterMap<T> {
    [key: string]: Getter<T>;
}

export interface MutationMap<T> {
    [key: string]: Mutator<T>;
}

export interface SubscriberMap {
    [key: string]: Subscriber[];
}

export type Getter<T> = (state: T) => any;
export type Mutator<T> = (state: T, payload: any) => void;
export type Subscriber = (data: any) => void;

export function createStore<T>(options: StoreOptions<T>): Store<T> {
    return new Store(options);
}

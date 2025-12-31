
import type {
    UnwrappedDomain,
    DirectionType
} from "../Domain";
import type {
    EnsureArray,
    AreTupleLengthsEqual
} from "../typeUtilities";
import {
    IpcMainEvent,
    IpcRendererEvent
} from "electron";

type EventType = "sends" | "invokes";

type ListenerEvent<Dir extends DirectionType> =
    Dir extends "RendererToMain" ? IpcMainEvent : IpcRendererEvent;

type InvokeListener<Req, Res, Dir extends DirectionType> = (
    event: ListenerEvent<Dir>,
    ...args: EnsureArray<Req>
) => Promise<Res> | Res;

type InvokeRegistrar<
    D extends UnwrappedDomain,
    Dir extends DirectionType
> = <Channel extends keyof D[Dir]["invokes"]>(
    channel: Channel,
    listener: InvokeListener<
        D[Dir]["invokes"][Channel]["req"],
        D[Dir]["invokes"][Channel]["res"],
        Dir
    >
) => void;

type SendListener<Req, Dir extends DirectionType> = (
    event: ListenerEvent<Dir>,
    ...args: EnsureArray<Req>
) => void;

type SendRegistrar<
    D extends UnwrappedDomain,
    Dir extends DirectionType
> = <Channel extends keyof D[Dir]["sends"]>(
    channel: Channel,
    listener: SendListener<
        D[Dir]["sends"][Channel]["req"],
        Dir
    >
) => void;

class Listeners<
    D extends UnwrappedDomain,
    Direction extends DirectionType
>{

    private domain: D;
    private direction: Direction;
    private invokeListeners: Partial<{
        [InvokeChannel in keyof D[Direction]["invokes"]]: InvokeListener<
            D[Direction]["invokes"][InvokeChannel]["req"],
            D[Direction]["invokes"][InvokeChannel]["res"],
            Direction
        >
    }> = {};
    private registerInvokeListener: InvokeRegistrar<D, Direction>;
    private sendListeners: Partial<{
        [Channel in keyof D[Direction]["sends"]]: SendListener<
            D[Direction]["sends"][Channel]["req"],
            Direction
        >
    }> = {};
    private registerSendListener: SendRegistrar<D, Direction>;

    constructor({
        domain,
        direction, 
        registerInvokeListener,
        registerSendListener
    }: {
        domain: D;
        direction: Direction;
        registerInvokeListener: InvokeRegistrar<D, Direction>;
        registerSendListener: SendRegistrar<D, Direction>;
    }) {
        this.domain = domain;
        this.direction = direction;
        this.registerInvokeListener = registerInvokeListener;
        this.registerSendListener = registerSendListener;
    };

    public getDomainName(): string {
        return this.domain.name;
    };

    public register(): void {

        // Register handlers
        const invokeListeners = this.invokeListeners;
        for (const eventName in invokeListeners) {
            const invokeListener = invokeListeners[eventName];
            if (invokeListener === undefined) {
                throw new Error(`Failed to register ${eventName}`);
            };
            this.registerInvokeListener(eventName, invokeListener);
        };

        // Register send listeners
        const sendListeners = this.sendListeners;
        for (const eventName in sendListeners) {
            const sendListener = sendListeners[eventName];
            if (sendListener === undefined) {
                throw new Error(`Failed to register ${eventName}`);
            };
            this.registerSendListener(eventName, sendListener);
        };

    };

    public addHandler<
        Channel extends keyof D[Direction]["invokes"],
        Req extends D[Direction]["invokes"][Channel]["req"],
        Res extends D[Direction]["invokes"][Channel]["res"],
        Listener extends InvokeListener<Req, Res, Direction>,
        GivenArgs extends Parameters<Listener>,
        ExpectedArgs extends [ListenerEvent<Direction>, ...EnsureArray<Req>],
    >(
        channel: Channel,
        listener:
            Listener
            & AreTupleLengthsEqual<
                GivenArgs,
                ExpectedArgs
            >
    ): void {
        this.invokeListeners[channel] = listener;
    };

    public addOn<
        Channel extends keyof D[Direction]["sends"],
        Req extends D[Direction]["sends"][Channel]["req"],
        Listener extends SendListener<Req, Direction>,
        GivenArgs extends Parameters<Listener>,
        ExpectedArgs extends [ListenerEvent<Direction>, ...EnsureArray<Req>]
    >(
        channel: Channel,
        listener:
            Listener
            & AreTupleLengthsEqual<
                GivenArgs,
                ExpectedArgs
            >
    ): void {
        this.sendListeners[channel] = listener;
    };

};

export function createListeners<
    D extends UnwrappedDomain,
    Direction extends DirectionType
>({
    domain,
    direction,
    registerSendListener,
    registerInvokeListener
}: {
    domain: D;
    direction: Direction;
    registerSendListener: SendRegistrar<D, Direction>;
    registerInvokeListener: InvokeRegistrar<D, Direction>;
}) {

    const listeners = new Listeners({
        domain: domain,
        direction,
        registerSendListener,
        registerInvokeListener
    });

    return {
        addOn: listeners.addOn.bind(listeners),
        addHandler: listeners.addHandler.bind(listeners),
        register: listeners.register.bind(listeners)
    } satisfies {
        addOn: typeof listeners.addOn;
        addHandler: typeof listeners.addHandler;
        register: typeof listeners.register;
    };

};

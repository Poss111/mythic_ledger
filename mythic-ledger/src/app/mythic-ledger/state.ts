import { MachineConfig, setup } from "xstate";
import { RegisterRequest } from "../models/register-request";
import { MythicLedgerService } from "../mythic-ledger-service.service";


export const machine = setup({
    types: {
        context: {} as {},
        events: {} as
            | { type: "book" }
            | { type: "login" }
            | { type: "accept" }
            | { type: "acknowledge" }
            | { type: "loadUserDetails" }
            | { type: "requestABooking" }
            | { type: "logout" }
            | { type: "decline" },
    },
    actions: {
        registerUser: function ({ context, event }, params: unknown) {
            console.log("Registering user...", params);
            if ('mythicLedgerService' in context) {
                console.dir(context.mythicLedgerService);
            } else {
                console.error("MythicLedgerService is not initialized");
            }
        }
    },
    guards: {
        succesful: function ({ context, event }) {
            // Add your guard condition here
            return true;
        },
        failed: function ({ context, event }) {
            // Add your guard condition here
            return true;
        },
        exists: function ({ context, event }) {
            // Add your guard condition here
            return true;
        },
        doesNotExist: function ({ context, event }) {
            // Add your guard condition here
            return true;
        },
        successful: function ({ context, event }) {
            // Add your guard condition here
            return true;
        },
        "New guard": function ({ context, event }) {
            // Add your guard condition here
            return true;
        },
    },
})

export const stateSetup = (mythicLedgerService: MythicLedgerService) => {
    return {
        context: {
            mythicLedgerService: mythicLedgerService,
            user: {
                username: 'mock',
                business_name: 'Mock Business',
                business_address: '1234 Mock Street, Mock City, Mock State, 12345',
                business_phone: '123-456-7890',
                business_email: 'mockbusiness@mock.com',
            },
            hostname: window.location.hostname,
        },
        id: "MythicLedgerComponent",
        initial: "LoggedOut",
        states: {
            LoggedOut: {
                on: {
                    login: [
                        {
                            target: "LoggedIn",
                            guard: {
                                type: "succesful",
                            },
                        },
                        {
                            target: "FailedToLogin",
                            guard: {
                                type: "failed",
                            },
                        },
                    ],
                },
            },
            LoggedIn: {
                on: {
                    loadUserDetails: [
                        {
                            target: "ShowCurrentAvailableBookings",
                            guard: {
                                type: "exists",
                            },
                        },
                        {
                            target: "BookAnAppointment",
                            guard: {
                                type: "doesNotExist",
                            },
                        },
                    ],
                },
                entry: {
                    type: "registerUser",
                    params: ({ context }: { context: { username: string } }) => ({
                        username: context.username
                    }),
                },
            },
            FailedToLogin: {
                on: {
                    accept: {
                        target: "LoggedOut",
                    },
                },
            },
            BookAnAppointment: {
                on: {
                    book: [
                        {
                            target: "ShowContract",
                            guard: {
                                type: "successful",
                            },
                        },
                        {
                            target: "BookAnAppointment",
                            guard: {
                                type: "failed",
                            },
                        },
                    ],
                },
            },
            ShowCurrentAvailableBookings: {
                on: {
                    requestABooking: {
                        target: "BookAnAppointment",
                    },
                    logout: {
                        target: "LoggedOut",
                    },
                },
            },
            ShowContract: {
                on: {
                    accept: {
                        target: "ShowNewAppointment",
                    },
                    decline: {
                        target: "ShowCurrentAvailableBookings",
                    },
                },
            },
            ShowNewAppointment: {
                on: {
                    acknowledge: {
                        target: "ShowCurrentAvailableBookings",
                    },
                },
            },
        },
    }
};

export const machineSetup = {
    types: {
        context: {} as {},
        events: {} as
            | { type: "book" }
            | { type: "login" }
            | { type: "accept" }
            | { type: "acknowledge" }
            | { type: "loadUserDetails" }
            | { type: "requestABooking" }
            | { type: "logout" }
            | { type: "decline" },
    },
    actions: {
        registerUser: function ({ context, event }: { context: any; event: any }, params: unknown) {
            console.log("Registering user...", params);
            if ('mythicLedgerService' in context && context.mythicLedgerService instanceof MythicLedgerService) {
                context.mythicLedgerService.registerUser(context.user, context.hostname)
                    .subscribe((response: any) => {
                        console.log("User registered", response);
                    });
            } else {
                console.error("MythicLedgerService is not initialized");
            }
        }
    },
    guards: {
        succesful: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            return true;
        },
        failed: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            return true;
        },
        exists: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            return true;
        },
        doesNotExist: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            return true;
        },
        successful: function ({ context, event }: { context: any; event: any }) {
            // Add your guard condition here
            return true;
        },
    },
};

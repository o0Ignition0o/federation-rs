const op_worker_await_close = async (worker: Worker) => {
  return Deno.core.ops.op_worker_await_close(worker);
};

const op_worker_parent = (): Worker => {
  print(`${Object.keys(Deno.core.ops).join("\n")}`);
  return Deno.core.ops.op_worker_parent();
};

// deno-lint-ignore no-explicit-any
const op_worker_recv = async (worker: any): Promise<string | undefined> => {
  return Deno.core.ops.op_worker_recv(worker);
};

// deno-lint-ignore no-explicit-any
const op_worker_send = async (worker: any, message: string) => {
  return Deno.core.ops.op_worker_send(worker, message);
};

// deno-lint-ignore no-explicit-any
const op_worker_spawn = async (arg1: any, arg2: any) => {
  return Deno.core.ops.op_worker_spawn(arg1, arg2);
};

// deno-lint-ignore no-explicit-any
const op_worker_terminate = async (worker: Worker) => {
  return Deno.core.ops.op_worker_terminate(worker);
};

declare namespace Deno {
  namespace core {
    function opAsync(opName: string, ...args: any[]): Promise<any>;
    const ops: Record<string, (...args: unknown[]) => any>;
  }
}

const privateConstructor = Symbol();
let parentWorker: Worker = null;

export class Worker {
  // deno-lint-ignore no-explicit-any
  #worker: any;

  // deno-lint-ignore no-explicit-any
  constructor(privateParent: symbol, worker: Worker);
  constructor(baseUrl: string, url: string);
  constructor(arg1: unknown, arg2: unknown) {
    if (arg1 == privateConstructor) {
      this.#worker = arg2;
    } else {
      this.#worker = op_worker_spawn(arg1, arg2);
    }
  }

  sendMessage(message: string) {
    op_worker_send(this.#worker, message);
  }

  async receiveMessage(): Promise<string | undefined> {
    return await op_worker_recv(this.#worker);
  }

  terminate() {
    op_worker_terminate(this.#worker);
  }

  get closed(): Promise<void> {
    return op_worker_await_close(this.#worker);
  }

  static get parent(): Worker {
    if (parentWorker === null) {
      parentWorker = new Worker(privateConstructor, op_worker_parent());
    }
    return parentWorker;
  }
}

// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
const run = async () => {
  Worker.parent.sendMessage("hello from client");
  const message = await Worker.parent.receiveMessage();
  print(`worker got from main "${message}"`);
};

run();

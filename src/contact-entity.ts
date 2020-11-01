import * as zod from "zod";

export const pipe = <T extends any[], R>(
  fn1: (...args: T) => R,
  ...fns: Array<(a: R) => R>
) => {
  const piped = fns.reduce(
    (prevFn, nextFn) => (value: R) => nextFn(prevFn(value)),
    (value) => value
  );
  return (...args: T) => piped(fn1(...args));
};

function trim(s: string) {
  return s.trim();
}

function toLowerCase(s: string) {
  return s.toLowerCase();
}

export const Contact = zod.object({
  name: zod.string().min(1).max(1024).transform(pipe(trim)),
  email: zod.string().email().max(1024).transform(pipe(trim, toLowerCase)),
});

export type Contact = zod.infer<typeof Contact>;

export const ExistingContact = Contact.merge(
  zod.object({
    id: zod.string(),
    createdAt: zod.date(),
    updatedAt: zod.date(),
  })
);

export type ExistingContact = zod.infer<typeof ExistingContact>;

export const ContactUpdate = Contact.partial();

export type ContactUpdate = zod.infer<typeof ContactUpdate>;

// Todo extract
export function createTimestamps() {
  const now = new Date();
  return {
    createdAt: now,
    updatedAt: now,
  };
}

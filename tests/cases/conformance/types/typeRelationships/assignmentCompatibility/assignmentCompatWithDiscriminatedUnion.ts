// see 'typeRelatedToDiscriminatedType' in checker.ts:

// IteratorResult
namespace Example1 {
    type S = { done: boolean, value: number };
    type T =
        | { done: true, value: number }     // T0
        | { done: false, value: number };   // T1

    declare let s: S;
    declare let t: T;

    // S is assignable to T0 when S["done"] is true
    // S is assignable to T1 when S["done"] is false
    t = s;
}

// Dropping constituents of T
namespace Example2 {
    type S = { a: 0 | 2, b: 4 };
    type T = { a: 0,     b: 1 | 4 }     // T0
           | { a: 1,     b: 2 }         // T1
           | { a: 2,     b: 3 | 4 };    // T2
    declare let s: S;
    declare let t: T;

    // S is assignable to T0 when S["a"] is 0
    // S is assignable to T2 when S["a"] is 2
    t = s;
}

// Unmatched discriminants
namespace Example3 {
    type S = { a: 0 | 2, b: 4 };
    type T = { a: 0,     b: 1 | 4 }     // T0
           | { a: 1,     b: 2 | 4 }     // T1
           | { a: 2,     b: 3 };        // T2
    declare let s: S;
    declare let t: T;

    // S is assignable to T0 when S["a"] is 0
    // S is *not* assignable to T1 when S["b"] is 4
    // S is *not* assignable to T2 when S["a"] is 2
    t = s;
}

// Unmatched non-discriminants
namespace Example4 {
    type S = { a: 0 | 2, b: 4 };
    type T = { a: 0,     b: 1 | 4 }             // T0
           | { a: 1,     b: 2 }                 // T1
           | { a: 2,     b: 3 | 4, c: string }; // T2
    declare let s: S;
    declare let t: T;

    // S is assignable to T0 when S["a"] is 0
    // S is *not* assignable to T2 when S["a"] is 2 as S is missing "c"
    t = s;
}

// Maximum discriminant combinations
namespace Example5 {
    // NOTE: MAX_DISCRIMINANT_COMBINATIONS is currently 25
    //       3 discriminant properties with 3 types a piece
    //       is 27 possible combinations.
    type N = 0 | 1 | 2;
    type S = { a: N, b: N, c: N };
    type T = { a: 0, b: N, c: N }
           | { a: 1, b: N, c: N }
           | { a: 2, b: N, c: N }
           | { a: N, b: 0, c: N }
           | { a: N, b: 1, c: N }
           | { a: N, b: 2, c: N }
           | { a: N, b: N, c: 0 }
           | { a: N, b: N, c: 1 }
           | { a: N, b: N, c: 2 };
    declare let s: S;
    declare let t: T;

    // S *should* be assignable but the number of
    // combinations is too complex.
    t = s;
}

// https://github.com/Microsoft/TypeScript/issues/14865
namespace Example6 {
    type Style1 = {
        type: "A";
        data: string;
    } | {
        type: "B";
        data: string;
    };

    type Style2 = {
        type: "A" | "B";
        data: string;
    }

    const a: Style2 = { type: "A", data: "whatevs" };
    let b: Style1;
    a.type; // "A" | "B"
    b.type; // "A" | "B"
    b = a; // should be assignable
}
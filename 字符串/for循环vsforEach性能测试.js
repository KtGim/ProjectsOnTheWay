// 性能测试工具函数
function measurePerformance(fn, iterations = 1000000) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    const end = performance.now();
    return end - start;
}

// 测试数据
const testArray = Array.from({length: 1000}, (_, i) => i);
const testObject = Object.fromEntries(
    Array.from({length: 1000}, (_, i) => [`key${i}`, i])
);

console.log("=== for循环 vs forEach 性能测试 ===\n");

// ========== 测试1: 基本数组遍历 ==========
console.log("1. 基本数组遍历测试");
console.log("数组长度:", testArray.length);

// for循环测试
const forLoopTime = measurePerformance(() => {
    let sum = 0;
    for (let i = 0; i < testArray.length; i++) {
        sum += testArray[i];
    }
    return sum;
}, 100000);

// forEach测试
const forEachTime = measurePerformance(() => {
    let sum = 0;
    testArray.forEach(item => {
        sum += item;
    });
    return sum;
}, 100000);

console.log(`for循环: ${forLoopTime.toFixed(2)}ms`);
console.log(`forEach: ${forEachTime.toFixed(2)}ms`);
console.log(`性能差异: for循环比forEach快 ${(forEachTime / forLoopTime).toFixed(2)}倍\n`);

// ========== 测试2: 对象遍历 ==========
console.log("2. 对象遍历测试");
console.log("对象属性数量:", Object.keys(testObject).length);

// for...in循环测试
const forInTime = measurePerformance(() => {
    let sum = 0;
    for (let key in testObject) {
        sum += testObject[key];
    }
    return sum;
}, 100000);

// Object.keys + forEach测试
const objectForEachTime = measurePerformance(() => {
    let sum = 0;
    Object.keys(testObject).forEach(key => {
        sum += testObject[key];
    });
    return sum;
}, 100000);

// Object.entries + forEach测试
const objectEntriesTime = measurePerformance(() => {
    let sum = 0;
    Object.entries(testObject).forEach(([key, value]) => {
        sum += value;
    });
    return sum;
}, 100000);

console.log(`for...in循环: ${forInTime.toFixed(2)}ms`);
console.log(`Object.keys + forEach: ${objectForEachTime.toFixed(2)}ms`);
console.log(`Object.entries + forEach: ${objectEntriesTime.toFixed(2)}ms`);
console.log(`性能差异: for...in比Object.keys+forEach快 ${(objectForEachTime / forInTime).toFixed(2)}倍\n`);

// ========== 测试3: 不同数组大小的性能 ==========
console.log("3. 不同数组大小的性能测试");

const sizes = [100, 1000, 10000, 100000];

sizes.forEach(size => {
    const array = Array.from({length: size}, (_, i) => i);
    
    const forTime = measurePerformance(() => {
        let sum = 0;
        for (let i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return sum;
    }, 1000000 / size);
    
    const forEachTime = measurePerformance(() => {
        let sum = 0;
        array.forEach(item => {
            sum += item;
        });
        return sum;
    }, 1000000 / size);
    
    console.log(`数组大小 ${size}:`);
    console.log(`  for循环: ${forTime.toFixed(2)}ms`);
    console.log(`  forEach: ${forEachTime.toFixed(2)}ms`);
    console.log(`  性能比: ${(forEachTime / forTime).toFixed(2)}倍\n`);
});

// ========== 测试4: 提前退出场景 ==========
console.log("4. 提前退出场景测试");

const findArray = Array.from({length: 10000}, (_, i) => i);

// for循环提前退出
const forBreakTime = measurePerformance(() => {
    for (let i = 0; i < findArray.length; i++) {
        if (findArray[i] === 5000) {
            return i;
        }
    }
    return -1;
}, 100000);

// forEach无法提前退出（需要额外处理）
const forEachBreakTime = measurePerformance(() => {
    let found = -1;
    findArray.forEach((item, index) => {
        if (item === 5000 && found === -1) {
            found = index;
        }
    });
    return found;
}, 100000);

// some方法（可以提前退出）
const someTime = measurePerformance(() => {
    let found = -1;
    findArray.some((item, index) => {
        if (item === 5000) {
            found = index;
            return true;
        }
        return false;
    });
    return found;
}, 100000);

console.log(`for循环提前退出: ${forBreakTime.toFixed(2)}ms`);
console.log(`forEach无法提前退出: ${forEachBreakTime.toFixed(2)}ms`);
console.log(`some方法提前退出: ${someTime.toFixed(2)}ms`);
console.log(`性能差异: for循环比forEach快 ${(forEachBreakTime / forBreakTime).toFixed(2)}倍\n`);

// ========== 测试5: 异步场景 ==========
console.log("5. 异步场景测试");

async function asyncForLoop() {
    let results = [];
    for (let i = 0; i < 10; i++) {
        const result = await new Promise(resolve => setTimeout(() => resolve(i), 10));
        results.push(result);
    }
    return results;
}

async function asyncForEach() {
    let results = [];
    const promises = Array.from({length: 10}, (_, i) => 
        new Promise(resolve => setTimeout(() => resolve(i), 10))
    );
    
    promises.forEach(async (promise) => {
        const result = await promise;
        results.push(result);
    });
    
    return results;
}

async function asyncForAwait() {
    let results = [];
    const promises = Array.from({length: 10}, (_, i) => 
        new Promise(resolve => setTimeout(() => resolve(i), 10))
    );
    
    for (const promise of promises) {
        const result = await promise;
        results.push(result);
    }
    
    return results;
}

console.log("异步场景说明:");
console.log("- for循环: 顺序执行，总时间 = 所有异步操作时间之和");
console.log("- forEach: 并行执行，总时间 = 最慢的异步操作时间");
console.log("- for...of + await: 顺序执行，但语法更简洁\n");

// ========== 测试6: 内存使用情况 ==========
console.log("6. 内存使用情况分析");

function testMemoryUsage() {
    const largeArray = Array.from({length: 1000000}, (_, i) => i);
    
    // 测试for循环内存使用
    const forMemoryStart = process.memoryUsage().heapUsed;
    let sum1 = 0;
    for (let i = 0; i < largeArray.length; i++) {
        sum1 += largeArray[i];
    }
    const forMemoryEnd = process.memoryUsage().heapUsed;
    
    // 测试forEach内存使用
    const forEachMemoryStart = process.memoryUsage().heapUsed;
    let sum2 = 0;
    largeArray.forEach(item => {
        sum2 += item;
    });
    const forEachMemoryEnd = process.memoryUsage().heapUsed;
    
    console.log(`for循环内存使用: ${((forMemoryEnd - forMemoryStart) / 1024 / 1024).toFixed(2)}MB`);
    console.log(`forEach内存使用: ${((forEachMemoryEnd - forEachMemoryStart) / 1024 / 1024).toFixed(2)}MB`);
}

testMemoryUsage();

// ========== 性能总结 ==========
console.log("\n=== 性能总结 ===");
console.log("1. 基本遍历:");
console.log("   • for循环通常比forEach快2-3倍");
console.log("   • 主要原因是forEach需要创建函数调用上下文");

console.log("\n2. 对象遍历:");
console.log("   • for...in循环最快");
console.log("   • Object.keys + forEach次之");
console.log("   • Object.entries + forEach最慢");

console.log("\n3. 提前退出:");
console.log("   • for循环可以提前退出，性能最优");
console.log("   • forEach无法提前退出，需要额外处理");
console.log("   • some()方法可以提前退出，是forEach的替代方案");

console.log("\n4. 异步场景:");
console.log("   • for循环顺序执行，适合需要顺序处理的场景");
console.log("   • forEach并行执行，适合独立的异步操作");
console.log("   • for...of + await语法更简洁");

console.log("\n5. 内存使用:");
console.log("   • for循环内存使用更少");
console.log("   • forEach需要额外的函数调用栈");

console.log("\n=== 使用建议 ===");
console.log("• 性能关键场景: 使用for循环");
console.log("• 代码可读性优先: 使用forEach");
console.log("• 需要提前退出: 使用for循环或some()");
console.log("• 异步顺序执行: 使用for...of + await");
console.log("• 异步并行执行: 使用Promise.all()"); 
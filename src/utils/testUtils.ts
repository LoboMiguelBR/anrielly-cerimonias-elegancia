
export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration?: number;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  total: number;
  duration: number;
}

class SimpleTestRunner {
  private suites: TestSuite[] = [];
  private currentSuite: TestSuite | null = null;

  describe(name: string, fn: () => void) {
    const suite: TestSuite = {
      name,
      tests: [],
      passed: 0,
      failed: 0,
      total: 0,
      duration: 0
    };

    this.currentSuite = suite;
    const startTime = performance.now();
    
    try {
      fn();
    } catch (error) {
      console.error(`Suite ${name} failed:`, error);
    }
    
    suite.duration = performance.now() - startTime;
    suite.total = suite.tests.length;
    suite.passed = suite.tests.filter(t => t.passed).length;
    suite.failed = suite.tests.filter(t => !t.passed).length;
    
    this.suites.push(suite);
    this.currentSuite = null;
  }

  it(name: string, fn: () => void | Promise<void>) {
    if (!this.currentSuite) {
      throw new Error('Test must be inside a describe block');
    }

    const startTime = performance.now();
    const test: TestResult = {
      name,
      passed: false,
      duration: 0
    };

    try {
      const result = fn();
      
      // Handle async tests
      if (result instanceof Promise) {
        result
          .then(() => {
            test.passed = true;
            test.duration = performance.now() - startTime;
          })
          .catch((error) => {
            test.passed = false;
            test.error = error.message;
            test.duration = performance.now() - startTime;
          });
      } else {
        test.passed = true;
        test.duration = performance.now() - startTime;
      }
    } catch (error: any) {
      test.passed = false;
      test.error = error.message;
      test.duration = performance.now() - startTime;
    }

    this.currentSuite.tests.push(test);
  }

  getResults(): TestSuite[] {
    return this.suites;
  }

  run(): void {
    console.log('🧪 Executando testes...\n');
    
    let totalPassed = 0;
    let totalFailed = 0;
    let totalDuration = 0;

    this.suites.forEach(suite => {
      console.log(`📋 Suite: ${suite.name}`);
      console.log(`⏱️  Duração: ${suite.duration.toFixed(2)}ms`);
      
      suite.tests.forEach(test => {
        const icon = test.passed ? '✅' : '❌';
        const duration = test.duration ? ` (${test.duration.toFixed(2)}ms)` : '';
        console.log(`  ${icon} ${test.name}${duration}`);
        
        if (test.error) {
          console.log(`     Erro: ${test.error}`);
        }
      });
      
      console.log(`📊 Resultado: ${suite.passed}/${suite.total} passaram\n`);
      
      totalPassed += suite.passed;
      totalFailed += suite.failed;
      totalDuration += suite.duration;
    });

    console.log(`🎯 Resumo Final:`);
    console.log(`✅ Testes que passaram: ${totalPassed}`);
    console.log(`❌ Testes que falharam: ${totalFailed}`);
    console.log(`⏱️  Tempo total: ${totalDuration.toFixed(2)}ms`);
    console.log(`📈 Taxa de sucesso: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);
  }
}

// Simple assertion helpers
export const expect = (actual: any) => ({
  toBe: (expected: any) => {
    if (actual !== expected) {
      throw new Error(`Expected ${expected}, but got ${actual}`);
    }
  },
  
  toEqual: (expected: any) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
    }
  },
  
  toBeTruthy: () => {
    if (!actual) {
      throw new Error(`Expected truthy value, but got ${actual}`);
    }
  },
  
  toBeFalsy: () => {
    if (actual) {
      throw new Error(`Expected falsy value, but got ${actual}`);
    }
  },
  
  toContain: (expected: any) => {
    if (!actual.includes(expected)) {
      throw new Error(`Expected ${actual} to contain ${expected}`);
    }
  },
  
  toBeNull: () => {
    if (actual !== null) {
      throw new Error(`Expected null, but got ${actual}`);
    }
  },
  
  toBeUndefined: () => {
    if (actual !== undefined) {
      throw new Error(`Expected undefined, but got ${actual}`);
    }
  }
});

export const testRunner = new SimpleTestRunner();
export const { describe, it } = testRunner;

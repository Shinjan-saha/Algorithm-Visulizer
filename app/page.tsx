'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));


function* bubbleSteps(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
      yield [...arr];
    }
  }
}

function* insertionSteps(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
      yield [...arr];
    }
    arr[j + 1] = key;
    yield [...arr];
  }
}

function* selectionSteps(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
      yield [...arr];
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield [...arr];
    }
  }
}


const algorithms: Record<string, (arr: number[])=>Generator<number[]>> = {
  Bubble: (arr) => bubbleSteps(arr),
  Insertion: (arr) => insertionSteps(arr),
  Selection: (arr) => selectionSteps(arr),
};

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [speed, setSpeed] = useState(200);
  const [sorting, setSorting] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [arrayA, setArrayA] = useState<number[]>([]);
  const [arrayB, setArrayB] = useState<number[]>([]);
  const [algoA, setAlgoA] = useState("Bubble");
  const [algoB, setAlgoB] = useState("Insertion");

  useEffect(() => {
    resetArray();
  }, []);

  const resetArray = () => {
    if (sorting) return;
    const arr = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 5);
    setArray(arr);
    setArrayA([...arr]);
    setArrayB([...arr]);
  };

  const runAlgorithm = async (algo: string) => {
    setSorting(true);
    let arr = [...array];
    const steps = algorithms[algo](arr);
    for (let step of steps) {
      setArray([...step]);
      await sleep(speed);
    }
    setSorting(false);
  };

  const runComparison = async () => {
    setSorting(true);
    let arr1 = [...arrayA];
    let arr2 = [...arrayB];

    const stepsA = algorithms[algoA](arr1);
    const stepsB = algorithms[algoB](arr2);

    while (true) {
      const nextA = stepsA.next();
      const nextB = stepsB.next();

      if (nextA.done && nextB.done) break;
      if (!nextA.done) setArrayA([...nextA.value]);
      if (!nextB.done) setArrayB([...nextB.value]);

      await sleep(speed);
    }

    setSorting(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
      <h1 className="text-4xl font-bold mb-6">Sorting Algorithm Visualizer</h1>

      {/* Mode toggle */}
      <div className="mb-4">
        <Button onClick={() => setCompareMode(!compareMode)} className="bg-teal-500 hover:bg-teal-600">
          {compareMode ? "Switch to Single Mode" : "Switch to Comparison Mode"}
        </Button>
      </div>

      {!compareMode ? (
        <>
          <div className="flex items-end space-x-1 h-64 mb-8">
            {array.map((val, idx) => (
              <div key={idx} style={{ height: `${val * 2}px` }}
                className="w-6 bg-pink-400 rounded-md shadow-md transition-all duration-300" />
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={resetArray} disabled={sorting} className="bg-yellow-500 hover:bg-yellow-600">Reset</Button>
            {Object.keys(algorithms).map(algo => (
              <Button key={algo} onClick={() => runAlgorithm(algo)} disabled={sorting} className="bg-blue-500 hover:bg-blue-600">{algo} Sort</Button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h2 className="text-xl mb-2">{algoA} Sort</h2>
              <div className="flex items-end space-x-1 h-64 bg-white/10 p-2 rounded">
                {arrayA.map((val, idx) => (
                  <div key={idx} style={{ height: `${val * 2}px` }} className="w-4 bg-green-400 rounded-md" />
                ))}
              </div>
              <select value={algoA} onChange={(e) => setAlgoA(e.target.value)} className="mt-2 text-black p-1 rounded">
                {Object.keys(algorithms).map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <h2 className="text-xl mb-2">{algoB} Sort</h2>
              <div className="flex items-end space-x-1 h-64 bg-white/10 p-2 rounded">
                {arrayB.map((val, idx) => (
                  <div key={idx} style={{ height: `${val * 2}px` }} className="w-4 bg-red-400 rounded-md" />
                ))}
              </div>
              <select value={algoB} onChange={(e) => setAlgoB(e.target.value)} className="mt-2 text-black p-1 rounded">
                {Object.keys(algorithms).map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={resetArray} disabled={sorting} className="bg-yellow-500 hover:bg-yellow-600">Reset</Button>
            <Button onClick={runComparison} disabled={sorting} className="bg-purple-500 hover:bg-purple-600">Run Comparison</Button>
          </div>
        </>
      )}

      <div className="mt-6 w-64">
        <p className="mb-2">Speed: {speed} ms</p>
        <Slider min={50} max={1000} step={50} value={[speed]} onValueChange={(val) => setSpeed(val[0])} />
      </div>
    </div>
  );
}

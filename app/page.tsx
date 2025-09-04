'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [speed, setSpeed] = useState(300);
  const [sorting, setSorting] = useState(false);

  useEffect(() => {
    resetArray();
  }, []);

  const resetArray = () => {
    if (sorting) return;
    const arr = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 5);
    setArray(arr);
  };

  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

  
  const bubbleSort = async () => {
    setSorting(true);
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep(speed);
        }
      }
    }
    setSorting(false);
  };

  
  const insertionSort = async () => {
    setSorting(true);
    let arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
        setArray([...arr]);
        await sleep(speed);
      }
      arr[j + 1] = key;
      setArray([...arr]);
    }
    setSorting(false);
  };

  
  const selectionSort = async () => {
    setSorting(true);
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        await sleep(speed);
      }
    }
    setSorting(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
      <h1 className="text-4xl font-bold mb-6">Sorting Algorithm Visualizer</h1>

      
      <div className="flex items-end space-x-1 h-64 mb-8">
        {array.map((val, idx) => (
          <div
            key={idx}
            style={{ height: `${val * 2}px` }}
            className="w-6 bg-pink-400 rounded-md shadow-md transition-all duration-300"
          />
        ))}
      </div>

      
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={resetArray} disabled={sorting} className="bg-yellow-500 hover:bg-yellow-600">Reset</Button>
        <Button onClick={bubbleSort} disabled={sorting} className="bg-blue-500 hover:bg-blue-600">Bubble Sort</Button>
        <Button onClick={insertionSort} disabled={sorting} className="bg-green-500 hover:bg-green-600">Insertion Sort</Button>
        <Button onClick={selectionSort} disabled={sorting} className="bg-red-500 hover:bg-red-600">Selection Sort</Button>
      </div>

     
      <div className="mt-6 w-64">
        <p className="mb-2">Speed: {speed} ms</p>
        <Slider min={50} max={1000} step={50} value={[speed]} onValueChange={(val) => setSpeed(val[0])} />
      </div>
    </div>
  );
}

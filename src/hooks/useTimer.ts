import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
	initialTime: number;
	onExpire?: () => void;
	autoStart?: boolean;
}

interface UseTimerReturn {
	timeRemaining: number;
	isRunning: boolean;
	start: () => void;
	pause: () => void;
	reset: (newTime?: number) => void;
	setTime: (time: number) => void;
}

export function useTimer({
	initialTime,
	onExpire,
	autoStart = false,
}: UseTimerOptions): UseTimerReturn {
	const [timeRemaining, setTimeRemaining] = useState(initialTime);
	const [isRunning, setIsRunning] = useState(autoStart);
	const intervalRef = useRef<number | null>(null);
	const onExpireRef = useRef(onExpire);

	// Keep onExpire callback reference updated
	useEffect(() => {
		onExpireRef.current = onExpire;
	}, [onExpire]);

	// Clear interval on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	// Timer logic
	useEffect(() => {
		if (!isRunning) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			return;
		}

		intervalRef.current = window.setInterval(() => {
			setTimeRemaining(prev => {
				if (prev <= 1) {
					setIsRunning(false);
					if (intervalRef.current) {
						clearInterval(intervalRef.current);
						intervalRef.current = null;
					}
					// Call onExpire callback
					if (onExpireRef.current) {
						onExpireRef.current();
					}
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isRunning]);

	const start = useCallback(() => {
		if (timeRemaining > 0) {
			setIsRunning(true);
		}
	}, [timeRemaining]);

	const pause = useCallback(() => {
		setIsRunning(false);
	}, []);

	const reset = useCallback((newTime?: number) => {
		setIsRunning(false);
		setTimeRemaining(newTime ?? initialTime);
	}, [initialTime]);

	const setTime = useCallback((time: number) => {
		setTimeRemaining(time);
	}, []);

	return {
		timeRemaining,
		isRunning,
		start,
		pause,
		reset,
		setTime,
	};
}

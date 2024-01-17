const getMonthName = (month: number) => {
	switch (month) {
		case 1:
			return 'Jan';
		case 2:
			return 'Feb';
		case 3:
			return 'Mar';
		case 4:
			return 'Apr';
		case 5:
			return 'May';
		case 6:
			return 'Jun';
		case 7:
			return 'Jul';
		case 8:
			return 'Aug';
		case 9:
			return 'Sep';
		case 10:
			return 'Oct';
		case 11:
			return 'Nov';
		case 12:
			return 'Dec';
	}
};

export const printRelativeTime = (date: Date) => {
	const now = new Date();

	const diff = now.getTime() - date.getTime();
	const seconds = diff / 1000;
	const minutes = seconds / 60;
	const hours = minutes / 60;
	const days = hours / 24;

	if (seconds < 60) return 'just now';
	if (minutes < 60) return `${Math.floor(minutes)} minutes ago`;
	if (hours < 24) return `${Math.floor(hours)} hours ago`;
	if (days < 7) return `${Math.floor(days)} days ago`;

	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	return `${year}-${getMonthName(month)}-${day}`;
};

export const printMonthYear = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;

	return `${getMonthName(month)} ${year}`;
};

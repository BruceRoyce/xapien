type StyleClass = string | { [k: string]: boolean } | string[];

type StyleMixer = (...classes: StyleClass[]) => string;

const cm: StyleMixer = (...classes) => {
	let styles: string = "";

	classes.forEach((classNameSet) => {
		if (typeof classNameSet === "string") {
			styles += ` ${classNameSet.trim()}`;
		} else if (typeof classNameSet === "object") {
			if (Array.isArray(classNameSet)) {
				styles += ` ${classNameSet.join(" ").trim()}`;
			} else {
				Object.entries(classNameSet).forEach(([key, value]) => {
					if (value) {
						styles += ` ${key.trim()}`;
					}
				});
			}
		}
	});
	return styles.trim();
};

export default cm;

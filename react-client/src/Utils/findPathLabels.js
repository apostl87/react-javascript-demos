import { capitalizeLetters, cleanString } from './generic';

const findPathLabels = (siteMap, segments_in, parentPath = "") => {
    let segments = [...segments_in];

    let paths = [];

    for (const page of siteMap) {

        if (segments[0] == page.path) {
            // Menu item found
            let currentPath = `${parentPath}/${page.path}`;
            paths.push({ label: page.label, to: currentPath, link: page.link });

            segments.shift();

            if (segments.length > 0) {
                if (page.children) {
                    // Find menu sub items
                    paths = paths.concat(findPathLabels(page.children, segments, currentPath));
                } else {
                    // Here, we deal with 3 more segments (even though more could exist) beyond the in-menu segments
                    for (const segment of segments.slice(0, 3)) {
                        const label = capitalizeLetters(cleanString(segment));
                        console.log(label, segment);
                        currentPath = `${currentPath}/${segment}`;
                        paths.push({ label: label, to: currentPath, link: true });
                    };
                }
            }

            break;
        }
    }
    return paths;
};

export default findPathLabels;
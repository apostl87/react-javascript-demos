import { capitalizeLetters, cleanString } from './generic';

const findPathLabels = (siteMap, segments_in, parentPath = "") => {
    let segments = [... segments_in];

    console.log("Segments", JSON.stringify(segments));

    let paths = [];

    for (const page of siteMap) {
        if (segments[0] == page.path) {
            // Menu item found
            const currentPath = `${parentPath}/${page.path}`;

            paths.push({ label: page.label, to: currentPath, link: page.link });

            segments.shift();

            if (segments.length > 0) {
                if (page.children) {
                    // Find menu sub items
                    paths = paths.concat(findPathLabels(page.children, segments, currentPath));
                } else {
                    // Here, we deal with 1 more segment (even though more could exist) that is beyond the in-menu segments
                    const segment = segments[0];
                    const label = capitalizeLetters(cleanString(segment))
                    paths.push({ label: label, to: `${currentPath}/${segment}`, link: true });
                }
            }

            console.log(JSON.stringify(paths));

            break;
        }
    }
    return paths;
};

export default findPathLabels;
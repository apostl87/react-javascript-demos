import { capitalizeLetters, cleanString } from './generic';

const findPathLabels = (siteMap, segments_in, parentPath = "") => {
    let pathSegments = [...segments_in];

    let paths = [];
    let currentPath = `${parentPath}`

    find: {
        for (const page of siteMap) {
            if (pathSegments[0] == page.path) {

                // Menu item found
                currentPath = `${currentPath}/${page.path}`;
                paths.push({ label: page.label, to: currentPath, link: page.link });

                pathSegments.shift();

                if (pathSegments.length > 0) {
                    if (page.children) {
                        // Find menu sub items
                        paths = paths.concat(findPathLabels(page.children, pathSegments, currentPath));
                    } else {
                        paths = paths.concat(addNonMenuPaths(pathSegments, currentPath))
                    }
                }
                break find;
            }
        }
        paths = paths.concat(addNonMenuPaths(pathSegments, currentPath))
    }
    return paths;
};


export default findPathLabels;


const addNonMenuPaths = (pathSegments, currentPath) => {
    // Here, we deal with 3 more path segments (even though more could exist) beyond the in-menu segments
    let paths = [];

    for (const segment of pathSegments.slice(0, 3)) {
        const label = capitalizeLetters(cleanString(segment));
        console.log(label, segment);
        currentPath = `${currentPath}/${segment}`;
        paths.push({ label: label, to: currentPath, link: true });
    };

    return paths;
}
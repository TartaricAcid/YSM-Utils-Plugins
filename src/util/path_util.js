export function arePathsEqual(path1, path2) {
    try {
        // 解析出绝对路径
        const absolutePath1 = fs.realpathSync(path1);
        const absolutePath2 = fs.realpathSync(path2);

        // 在 POSIX 系统上，路径是区分大小写的
        if (process.platform !== "win32") {
            return absolutePath1 === absolutePath2;
        } else {
            // 在 Windows 系统上，路径是不区分大小写的
            return absolutePath1.toLowerCase() === absolutePath2.toLowerCase();
        }
    } catch (err) {
        console.error("Error resolving paths:", err);
        return false;
    }
}
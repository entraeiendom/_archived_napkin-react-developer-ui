// import logger from 'simple-console-logger';
//
// const consoleLogger = logger();
// const log = (data) => consoleLogger(data);

export function logError(data, e) {
    let errorMessage, name;
    if (e) {
        try {
            errorMessage = e.message;
            name = e.name;
        } catch (e2) {

        }
    }
    if (process.env.NODE_ENV !== 'production') {
        console.error('**DEV LOG** ', { errorMessage, name, ...data });
    }
}

export function logWarn(data) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn('**DEV LOG** ', data);
    }
}

export function logInfo(data) {
    if (process.env.NODE_ENV !== 'production') {
        console.log('**DEV LOG** ', data);
    }
}
import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mimeType = (control: AbstractControl)
: Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    // * VALID when `imagePath` already exists as a string
    if(typeof(control.value) === 'string') {
        return of(null);
    }

    const file = control.value as File;
    const fileReader = new FileReader();
    const fileReader$ = new Observable((observer: Observer<{[key: string]: any}>) => {
        fileReader.addEventListener('loadend', () => {
            // * PUT TOGETHER FILE MAGIC NUMBER (https://stackoverflow.com/a/75516030)
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
            let header = ''; 
            for (const bytes of arr) {
                header += bytes.toString(16);
            }

            // * VALIDATE FILE MAGIC NUMBER (https://gist.github.com/leommoore/f9e57ba2aa4bf197ebc5)
            let isValid = false;
            switch (header) {
                case "89504e47": // png
                  isValid = true;
                  break;
                case "ffd8ffe0": // jpeg (jfif)
                case "ffd8ffe1": // jpeg (exif)
                case "ffd8ffe2": // jpeg (canon)
                case "ffd8ffe3": // jpeg (samsung)
                case "ffd8ffe8": // jpeg (spiff)
                  isValid = true;
                  break;
                default:
                  isValid = false; // Or you can use the blob.type as fallback
                  break;
            }

            // * ANGULAR VALIDATION RESULTS
            // `null` if valid; set of validation errors if not (https://angular.io/guide/form-validation#validator-functions)
            if (isValid) {
                observer.next(null);
            } else {
                observer.next({ invalidMimeType: true });
            }
            observer.complete();
        });

        // * READ FILE TO EXECUTE EVENT LISTENER
        fileReader.readAsArrayBuffer(file);  
    });

    return fileReader$;
}
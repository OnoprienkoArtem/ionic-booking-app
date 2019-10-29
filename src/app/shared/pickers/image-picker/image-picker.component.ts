import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
    Plugins,
    Capacitor,
    CameraSource,
    CameraResultType
} from '@capacitor/core';
@Component({
    selector: 'app-image-picker',
    templateUrl: './image-picker.component.html',
    styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit {
    @Output() imagePick = new EventEmitter<string>();
    selectedImage: string;

    constructor() {}

    onPickImage() {
        if (!Capacitor.isPluginAvailable('Camera')) {
            return;
        }
        Plugins.Camera.getPhoto({
            quality: 50,
            source: CameraSource.Prompt,
            correctOrientation: true,
            height: 320,
            width: 200,
            resultType: CameraResultType.Base64
        })
            .then(image => {
                this.selectedImage = image.base64Data;
                this.imagePick.emit(image.base64Data);
            })
            .catch(error => {
                console.log(error);
                return false;
            });
    }

    ngOnInit() {}
}

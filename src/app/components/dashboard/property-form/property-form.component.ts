import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, AfterViewInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdInputModule, MdRadioModule } from '@angular/material';
import { UserService } from '../../../services/user.service';
import { ListingService } from '../../../services/listing.service';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-property-form',
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.css']
})
export class PropertyFormComponent implements OnInit {
  @Input() name;
  @ViewChild('selectElem') el: ElementRef;

  newProperty: any = {};
  token: number = Date.now();
  filesSent = 0;
  loginForm: any;
  submittedInvalid = false;
  submitError: string;

  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  showFile(item, index) {
    readURL(item, index);
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  constructor(public dialogRef: MdDialogRef<PropertyFormComponent>, 
              public dialog: MdDialog,
              public userService: UserService,
              public listingService: ListingService
              ) {
                this.uploader = new FileUploader({url: `${environment.BASE_URL}/api/listings/${this.userService.user._id}`});
               }

  ngOnInit() {
     this.uploader.onBuildItemForm = (item, form) => {
        // console.log('onBuildItemForm');
        form.append('token', this.token);
        if (this.filesSent === 0) {
          form.append('newListing', true)
          form.append('property', JSON.stringify(this.newProperty));
        }
        this.filesSent++;
      };
  }

  doSubmit(formValid) {
    if (!formValid) {
      this.submitError = 'Please fill out the form';
      this.submittedInvalid = true;
    } else {
      if (this.uploader.queue.length === 0) {
        this.submitError = 'Please upload photos';
        this.submittedInvalid = true;
      } else {
        this.uploader.uploadAll();
        const dialogResult = this.dialog.open(DialogCreateNewPropertyComponent, {width: '30%', height: '16%'})
        dialogResult.afterClosed().subscribe(result => {
          this.dialogRef.close('submitted')
        });
      }
    }
  }
}

@Component({
  selector: 'app-dialog-result-example-dialog',
  template: `
<div md-dialog-content>Listing has been created...</div>
`,
})

export class DialogCreateNewPropertyComponent implements OnInit {
  constructor(public dialogRef: MdDialogRef<DialogCreateNewPropertyComponent>) {}
  ngOnInit() {
     setTimeout( () => this.dialogRef.close('submitted'), 1000);
  }
}

function readURL(input, index) {
    if ($('#fileImage' + index).attr('src') === '#') {
      const reader = new FileReader();
      reader.onload = function (e) {
          $('#fileImage' + index).attr('src', (e.target as any).result);
      }
      $('#fileImage' + index).attr('src', '##')
      reader.readAsDataURL(input._file);
    }
}

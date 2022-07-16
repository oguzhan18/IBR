import { FormBuilder, FormGroup } from "@angular/forms";
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { RemovalAIService } from '../service/removal-ai.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ModalManager } from 'ngb-modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-imageupload',
  templateUrl: './imageupload.component.html',
  styleUrls: ['./imageupload.component.scss']
})
export class ImageuploadComponent implements OnInit {

  @ViewChild('myModal') myModal: any;

  imageUrl: string = "https://file.removal.ai/low_resolution/7aba9b9d-2dcb-4063-8b41-4cd6b707ce56_test-women.png";
  base64image: any;

  showPreview: Boolean = false;
  activeIndex: number = 0;
  showOriginal: boolean = true;
  showConverted: boolean = false;
  convertedImgData: any = [];
  filePath: any = [];
  showDownloadButton: boolean = false;
  showSuccessMsg: boolean = false;
  downloadUrl: any = [];
  myForm!: FormGroup;
  public show2: boolean = false;
  imgData: any = [];
  public payPalConfig?: IPayPalConfig;
  showSuccess: boolean = false;
  ratePerImage: any = 1.2;
  convertingImageCount: number = 0;
  showLoader: boolean = false;
  private modalRef: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  public show: boolean = true
  clearData: boolean = false
  totalBilling: any = 0;
  totalQuantity: any = 0;

  constructor(
    public fb: FormBuilder,
    public _BackgroundRemovingService: RemovalAIService,
    private modalService: ModalManager,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {
    this.myForm = this.fb.group({
      img: [null],
      filename: ['']
    })
  }

  ngOnInit(): void {
    this.initConfig();
  }

  private initConfig(): void {
    this.payPalConfig = {
      clientId: "AYvU7p49APJ3TWCP7EPq6Z1Sm7LijDirPdDI-G6DjNasJ2tyIVCwb0IZL1v5cKy_tw7qPr_2ybS62gCR",
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: this.totalBilling,
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: this.totalBilling
                  }
                }
              },
              items: [
                {
                  name: "Background Removal of Image",
                  quantity: this.totalQuantity,
                  category: "DIGITAL_GOODS",
                  unit_amount: {
                    currency_code: "USD",
                    value: this.totalBilling
                  }
                }
              ]
            }
          ]
        },
      advanced: {
        commit: "true"
      },
      style: {
        label: "paypal",
        layout: "vertical"
      },
      onApprove: (data, actions) => {
        console.log(
          "onApprove - transaction was approved, but not authorized",
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            "onApprove - you can get full order details inside onApprove: ",
            details
          );
          // Uncomment this line before testing payment method and moving for deployment.
          // this.convertImages()
        });
      },
      onClientAuthorization: data => {
        console.log(
          "onClientAuthorization - you should probably inform your server about completed transaction at this point",
          data
        );
      },
      onCancel: (data, actions) => {
        console.log("OnCancel", data, actions);
      },
      onError: err => {
        console.log("OnError", err);
      },
      onClick: (data, actions) => {
        console.log("onClick", data, actions);
      }
    };
  }

  showing() {
    this.show = !this.show
  }

  CalculatePricing() {
    var imageData = this.downloadUrl.filter((x: any) => x.isURLavailable == false);
    this.totalQuantity = (imageData.length).toString();
    this.totalBilling = (imageData.length * this.ratePerImage).toString();
  }

  toggleImagePreview() {
    if (this.showOriginal == true) {
      this.showOriginal = false;
      this.showConverted = true;
    }
    else {
      this.showOriginal = true;
      this.showConverted = false;
    }
  }

  setActiveIndex(i: any) {
    this.activeIndex = i
  }

  imagePreview(e: Event) {
    this.showPreview = false;
    if (this.imgData.length < 4) {
      var file: any = e.target as HTMLInputElement;
      file = file.files[0]
      this.myForm.patchValue({
        img: file
      });
      if (file != undefined || file != null) {

        let downloadURLobj: any = {
          previewUrl: null,
          lowResolutionUrl: null,
          highResolutionUrl: null,
          original_height: null,
          original_width: null,
          preview_height: null,
          preview_width: null,
          isURLavailable: false
        }

        this.downloadUrl.push(downloadURLobj)

        this.imgData.push(file)
        this.myForm.get('img')?.updateValueAndValidity()
        const reader = new FileReader();
        reader.onload = () => {
          this.filePath.push(reader.result as string);
        }
        reader.readAsDataURL(file)

        this.myForm = this.fb.group({
          img: [null],
          filename: ['']
        })
      }
    }
    else {
      console.log("Inside Else")
      this.openSnackBar("You Cannot Upload More Then 3 Images")
    }
  }

  submit() {
    console.log(this.myForm.value)
  }

  convertImages() {
    if (this.imgData.length < 4) {
      this.showLoader = true;
      this.spinner.show()
      if (this.convertingImageCount < this.imgData.length) {
        var imageData = new FormData();
        imageData.append("image_file", this.imgData[this.convertingImageCount], this.filePath[this.convertingImageCount].name);
        imageData.append("image_url", "");

        if (this.downloadUrl[this.convertingImageCount].isURLavailable == false) {
          this._BackgroundRemovingService.convertImageUsingRemovalAI(imageData).subscribe(
            data => {
              console.log("Image Data Showing")
              console.log(data)

              //When you are using Production or for deployment usecase
              // Uncomment the below line
              //it provide download URL for high resolution images
              // checkout commented message on line number 221 & 237 in template page

              // this.downloadUrl[this.convertingImageCount].highResolutionUrl = data.high_resolution
              this.downloadUrl[this.convertingImageCount].lowResolutionUrl = data.low_resolution;
              this.downloadUrl[this.convertingImageCount].previewUrl = data.preview_demo;
              this.downloadUrl[this.convertingImageCount].original_height = data.original_height;
              this.downloadUrl[this.convertingImageCount].original_width = data.original_width;
              this.downloadUrl[this.convertingImageCount].preview_height = data.preview_height;
              this.downloadUrl[this.convertingImageCount].preview_width = data.preview_width;
              this.downloadUrl[this.convertingImageCount].isURLavailable = true;
            },
            err => {
              this.openSnackBar("Server Error: Conversion Failed !");
              this.showLoader = false;
              this.spinner.hide();
              this.closeModal();
            },
            () => {
              this._BackgroundRemovingService.getBase64ImageFromURL(this.downloadUrl[this.convertingImageCount].previewUrl).subscribe(
                (data: any) => {
                  console.log(data);
                  this.base64image = 'data:image/jpg;base64,' + data;
                  this.convertedImgData[this.convertingImageCount] = this.base64image
                },
                (err: any) => {
                  console.log(err)
                },
                () => {
                  this.convertingImageCount = this.convertingImageCount + 1;
                  this.convertImages();
                });
            }
          )
        }
        else {
          this.convertingImageCount = this.convertingImageCount + 1;
          this.convertImages();
        }
      }
      else {
        this.showPreview = true;
        this.showLoader = false;
        this.showSuccessMsg = true;
        this.convertingImageCount = 0;
        this.showDownloadButton = true;
        this.spinner.hide();
        this.clearData = false;
        this.closeModal();
      }
    }
    else {
      this.openSnackBar("You Cannot Upload More Then 3 Images")
    }
  }

  openModal() {
    console.log("Envoirnment Token : ", environment.removalAiToken)
    this.modalRef = this.modalService.open(this.myModal, {
      size: "md",
      modalClass: 'mymodal',
      hideCloseButton: true,
      centered: false,
      backdrop: true,
      animation: true,
      keyboard: false,
      closeOnOutsideClick: true,
      backdropClass: "modal-backdrop"
    })
    // this.show2 = true
  }

  closeModal() {
    this.modalService.close(this.modalRef);
    this.show2 = false
    this.show = true
  }

  showPaymentOption() {
    this.show2 = !this.show2;
    this.show = !this.show;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 4000,
      panelClass: ['blue-snackbar']
    });
  }

  removeImage(i: any) {
    console.log("Image Data", this.imgData)
    console.log("FilePath Data", this.filePath)
    console.log("Download URL", this.downloadUrl)
    this.imgData.splice(i, 1)
    this.filePath.splice(i, 1)
    this.downloadUrl.splice(i, 1)
    this.convertedImgData.splice(i, 1)
    console.log("Image Data", this.imgData)
    console.log("FilePath Data", this.filePath)
    console.log("Download URL", this.downloadUrl)
  }

  // clearDownloadedImages() {
  //   console.log("Download URL : ", this.downloadUrl)
  //   console.log("Clear Data Check", this.clearData)
  //   if (this.downloadUrl.length > 0 && this.clearData == false) {
  //     console.log("Clear Download Condition # 1")
  //     this.closeModal();
  //     this.openSnackBar(`
  //     Please Download the Converted Image & Remove Them Before the Next Conversion. Else Your Data Will be Lost
  //     `)
  //     this.clearData = true;
  //   }
  //   else {
  //     console.log("Clear Download Condition # 2")
  //     this.downloadUrl = [];
  //     this.convertImages()
  //   }
  // }

}

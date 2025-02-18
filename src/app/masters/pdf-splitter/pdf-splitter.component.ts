import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { PermissionService } from "../../shared/services/permission.service";
import { ImageEditorService } from "../../image-editor/image-editor.service";
import { HeaderService } from "../../shared/services/header.service";
import jsPDF from "jspdf";
import { ToastService } from "../../shared/services/toast.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-pdf-splitter",
  templateUrl: "./pdf-splitter.component.html",
  styleUrl: "./pdf-splitter.component.css",
})
export class PdfSplitterComponent implements OnInit, OnDestroy {
  @ViewChild("imageCanvas", { static: false }) canvas: ElementRef<HTMLCanvasElement> | any;

  private context: CanvasRenderingContext2D | any;
  currentImageIndex = 0; // Track the current image
  private img = new Image();

  templateForm: FormGroup | any;
  resultSubscription: Subscription | any;

  images: string[] = [];
  actionPermissions: { [key: string]: boolean } = {};
  constructor(
    private headerService: HeaderService,
    private toastService: ToastService,
    private imageEditorService: ImageEditorService,
    private permissionService: PermissionService,
    private datePipe: DatePipe
  ) {
    headerService.updateHeader({
      title: "PDF Splitter",
      icon: "property",
    });
  }

  ngOnInit(): void {
    this.actionPermissions = {
      delete: this.permissionService.hasPermission("pdfSplitter"),
    };
    this.templateForm = new FormGroup({
      startPageNo: new FormControl("", [Validators.required]),
      endPageNo: new FormControl("", [Validators.required]),
    });
  }

  loadImage() {
    this.context = this.canvas.nativeElement.getContext("2d");
    this.img.src = this.images[this.currentImageIndex]; // Replace with your image path
    this.img.onload = () => {
      // Set canvas dimensions to match the image
      this.canvas.nativeElement.width = this.img.width; // 990px width
      this.canvas.nativeElement.height = this.img.height; // 763px height
      this.canvas.width = this.img.width;
      this.canvas.height = this.img.height;
      // Draw the image on the canvas

      this.adjustCanvasSize();
      this.drawImageOnCanvas();
    };
  }

  ngOnDestroy(): void {
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
  }

  // Adjust canvas size based on the image
  adjustCanvasSize(): void {
    const canvasElement = this.canvas.nativeElement;
    canvasElement.width = canvasElement.parentElement.offsetWidth;
    const aspectRatio = this.img.width / this.img.height;
    canvasElement.height = canvasElement.width / aspectRatio;
  }

  // Draw the image on the canvas
  drawImageOnCanvas(): void {
    const canvasElement = this.canvas.nativeElement;
    const context = this.context;

    // Clear the canvas before redrawing
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Draw the image with scaling based on zoomLevel
    context.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, canvasElement.width, canvasElement.height);
  }

  // Handle Next button click to change the image
  nextImage(): void {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
      this.loadImage(); // Load the new image
    }
  }

  // Handle Previous button click to change the image
  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.loadImage(); // Load the new image
    }
  }

  resetForm() {
    this.templateForm.reset();
  }

  fileUploadVisible: boolean = true;
  fileChange(event: any) {
    if (event.target.files.length > 0) {
      this.images = [];
      this.currentImageIndex = 0;
      this.resetForm();
      let fileList: FileList = event.target.files;
      this.imageEditorService.getImagesFromPdf(fileList[0]).subscribe((res: any) => {
        this.fileUploadVisible = false;
        for (let i = 0; i < res.images.length; i++) {
          this.images.push("data:image/jpeg;base64," + res.images[i]);
        }
        setTimeout(() => {
          this.fileUploadVisible = true;
        }, 100);
        this.loadImage();
      });
    }
  }

  downloadPDF() {
    let startPageNo = +this.templateForm.value.startPageNo;
    let endPageNo = +this.templateForm.value.endPageNo;

    // check if startPageNo is greater than endPageNo
    if (startPageNo > endPageNo) {
      this.toastService.showError("Start page no should be less than end page no", "Error");
      return;
    }
    // check if startPageNo and endPageNo are not negative
    if (startPageNo < 0 || endPageNo < 0) {
      this.toastService.showError("Start page no and end page no should not be negative", "Error");
      return;
    }
    // check if startPageNo and endPageNo are less than 1
    if (startPageNo == 0 || endPageNo == 0) {
      this.toastService.showError("Start page no and end page no should not be 0", "Error");
      return;
    }
    // get images from this.images based on startPageNo and endPageNo
    let selectedImages = this.images.slice(startPageNo - 1, endPageNo);

    const pdf = new jsPDF("p", "mm", "a4"); // Portrait mode, millimeters, A4 size
    let yOffset = 0; // Y position for images

    selectedImages.forEach((imageUrl, index) => {
      const img = new Image();
      img.src = imageUrl;
      img.crossOrigin = "anonymous"; // To avoid CORS issues

      img.onload = () => {
        const pageWidth = pdf.internal.pageSize.getWidth(); // Get A4 width (210mm)
        const pageHeight = pdf.internal.pageSize.getHeight(); // Get A4 height (297mm)

        let imgWidth = pageWidth; // Default: Full-page width
        let imgHeight = (img.height * imgWidth) / img.width; // Maintain aspect ratio

        // Ensure image fits within page height
        if (imgHeight > pageHeight) {
          imgHeight = pageHeight;
          imgWidth = (img.width * imgHeight) / img.height; // Adjust width based on new height
        }

        const imgX = (pageWidth - imgWidth) / 2; // Center horizontally

        if (index !== 0) {
          pdf.addPage(); // Add a new page for each image
        }

        pdf.addImage(img, "JPEG", imgX, 0, imgWidth, imgHeight);

        if (index === selectedImages.length - 1) {
          pdf.save("enhancor_" + new Date().getTime() + ".pdf");
        }
      };
    });
  }
}

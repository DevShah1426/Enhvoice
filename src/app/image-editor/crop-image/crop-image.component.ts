import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ImageEditorService } from "../image-editor.service";
import { HeaderService } from "../../shared/services/header.service";
import { ToastService } from "../../shared/services/toast.service";
import { AlertDialogService } from "../../shared/services/alert-dialog.service";
import { AlertDetails } from "../../shared/models/alert-details";
import { Subscription } from "rxjs";
import { fields } from "../../shared/constants/fields";
import { GroupService } from "../../masters/group/group.service";
import { ProviderService } from "../../masters/provider/provider.service";
import { UtilityService } from "../../masters/utility/utility.service";
import { PermissionService } from "../../shared/services/permission.service";

@Component({
  selector: "app-crop-image",
  templateUrl: "./crop-image.component.html",
  styleUrl: "./crop-image.component.css",
})
export class CropImageComponent implements OnInit, OnDestroy {
  @ViewChild("imageCanvas", { static: false }) canvas: ElementRef<HTMLCanvasElement> | any;

  private context: CanvasRenderingContext2D | any;
  currentImageIndex = 0; // Track the current image
  private img = new Image();
  private isDrawing = false;
  private startX = 0;
  private startY = 0;
  private currentX = 0;
  private currentY = 0;
  private originalImage: ImageData | any;

  // Array to store rectangle coordinates
  rectangles: any[] = [];
  templates: any[] = [];
  selectedTemplate: any = "";

  utilities: any[] = [];
  selectedUtility: any = "";

  properties: any[] = [];
  selectedProperty: any = "";

  providers: any[] = [];
  selectedProvider: any = "";

  fields: any[] = fields;
  selectedField: any = "";

  templateForm: FormGroup | any;
  resultSubscription: Subscription | any;
  previousUtility: any = "";

  images: string[] = [];
  actionPermissions: { [key: string]: boolean } = {};
  constructor(
    private utilityService: UtilityService,
    private headerService: HeaderService,
    private toastService: ToastService,
    private alertDialogService: AlertDialogService,
    private groupService: GroupService,
    private providerService: ProviderService,
    private imageEditorService: ImageEditorService,
    private permissionService: PermissionService
  ) {
    headerService.updateHeader({
      title: "Template Creation",
      icon: "property",
    });
  }
  dataColumns: any[] = [
    { field: "pageNo", header: "Page No.", width: "20%" },
    { field: "label", header: "Field", width: "30%" },
    { field: "fieldLabel", header: "Field Label", width: "50%" },
  ];
  dataList: any[] = [];

  ngOnInit(): void {
    // in fields remove any key that contains currentRead, readType, previousRead, totalUsage
    this.fields = this.fields.filter((field: any) => {
      return (
        !field.key.includes("currentRead") &&
        !field.key.includes("readType") &&
        !field.key.includes("previousRead") &&
        !field.key.includes("totalUsage") &&
        !field.key.includes("meterNumber1") &&
        !field.key.includes("meterNumber2") &&
        !field.key.includes("meterNumber3") &&
        !field.key.includes("meterNumber4") &&
        !field.key.includes("meterNumber5") &&
        !field.key.includes("meterNumber6") &&
        !field.key.includes("meterNumber7") &&
        !field.key.includes("meterNumber8") &&
        !field.key.includes("meterNumber9") &&
        !field.key.includes("meterNumber10")
      );
    });

    this.actionPermissions = {
      delete: this.permissionService.hasPermission("template"),
    };
    this.getProperties();
    this.getProviders();
    this.getUtilities();
    this.templateForm = new FormGroup({
      propertyId: new FormControl("", [Validators.required]),
      providerId: new FormControl("", [Validators.required]),
      templateName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      utilityId: new FormControl("", [Validators.required]),
      fieldId: new FormControl("", [Validators.required]),
      fieldName: new FormControl(""),
    });
    window.addEventListener("keydown", this.onArrowKeyPress.bind(this));
  }

  getProperties() {
    this.groupService.getAllNotArchivedGroups().subscribe((res: any) => {
      this.properties = res;
    });
  }

  getProviders() {
    this.providerService.getAllProviders().subscribe((res: any) => {
      this.providers = res.providerDao;
    });
  }

  getUtilities() {
    this.utilityService.getAllUtilities().subscribe((res: any) => {
      this.utilities = res.utilityDao;
    });
  }

  onPropertySelect(event: any) {
    this.templateForm.get("propertyId").setValue(event.value.id);
  }

  onProviderSelect(event: any) {
    this.templateForm.get("providerId").setValue(event.value.id);
  }

  loadImage() {
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
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
      this.showAllSelections();
    };
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event): void {
    this.rectangles = [];
    this.dataList = [];
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.clearRectangles();
    this.loadImage();
  }

  ngOnDestroy(): void {
    window.removeEventListener("keydown", this.onArrowKeyPress.bind(this));
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
  }

  onSelect(event: any) {
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.selectedField = event.value;
    this.templateForm.get("fieldId").setValue(event.value);
    this.clearRectangles();
    this.showAllSelections();
  }

  onUtilitySelect(event: any) {
    if (this.selectedUtility != "" && this.selectedUtility != event.value) {
      let alertDialogDetails: AlertDetails = {
        showWarningIcon: true,
        title: "Change Utility?",
        message: "Changing utility will clear all fields and selection?",
        showOkButton: true,
        okButtonLabel: "Reset",
      };
      this.alertDialogService.openAlertDialog(alertDialogDetails);
      // Unsubscribe from any previous subscription
      if (this.resultSubscription) {
        this.resultSubscription.unsubscribe();
      }
      this.resultSubscription = this.alertDialogService.result$.subscribe((result: any) => {
        if (result) {
          window.location.reload();
        } else {
          this.selectedUtility = this.previousUtility;
          this.templateForm.get("utilityId").setValue(this.previousUtility);
        }
      });
    } else {
      this.selectedUtility = event.value;
      this.previousUtility = JSON.parse(JSON.stringify(event.value));
      this.templateForm.get("utilityId").setValue(event.value);
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
    context.drawImage(
      this.img,
      0,
      0,
      this.img.width,
      this.img.height,
      this.panX,
      this.panY,
      canvasElement.width * this.zoomLevel,
      canvasElement.height * this.zoomLevel
    );
    // Save the original image data for later (for undo/redo, etc.)
    this.originalImage = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
  }

  // Handle Next button click to change the image
  nextImage(): void {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
      this.clearRectangles(); // Clear previous rectangles
      this.loadImage(); // Load the new image
    }
  }

  // Handle Previous button click to change the image
  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.clearRectangles(); // Clear previous rectangles
      this.loadImage(); // Load the new image
    }
  }

  // Triggered when the mouse is pressed
  onMouseDown(event: MouseEvent): void {
    if (this.selectedField === "") {
      this.clearRectangles();
      this.isDrawing = false;
      this.startX = 0;
      this.startY = 0;
      this.currentX = 0;
      this.currentY = 0;
      return;
    } else {
      this.isDrawing = true;
      this.startX = event.offsetX;
      this.startY = event.offsetY;
    }
  }

  // Triggered when the mouse is moved
  onMouseMove(event: MouseEvent): void {
    if (!this.isDrawing) return;

    this.currentX = event.offsetX;
    this.currentY = event.offsetY;

    // Clear the canvas and redraw the image before drawing the rectangle
    this.context.putImageData(this.originalImage, 0, 0);
    this.drawRectangle();
  }

  // Triggered when the mouse is released
  onMouseUp(event: MouseEvent): void {
    if (this.selectedField === "") {
      this.toastService.showError("Please select field");
      this.clearRectangles();
      this.isDrawing = false;
      return;
    }
    this.isDrawing = false;
    this.currentX = event.offsetX;
    this.currentY = event.offsetY;

    // Finalize the rectangle drawing and apply the overlay
    this.drawRectangle();
    this.applyOverlay();

    // Store rectangle coordinates in the array
    const rectWidth = this.currentX - this.startX;
    const rectHeight = this.currentY - this.startY;
    if (rectWidth <= 0 || rectHeight <= 0) {
      this.clearRectangles();
      return;
    }
  }

  fillRectangles(): void {
    // Scale factors to convert between screen and image coordinates
    const scaleX = this.img.width / this.canvas.nativeElement.width;
    const scaleY = this.img.height / this.canvas.nativeElement.height;

    // Calculate rectangle dimensions
    const rectWidth = this.currentX - this.startX;
    const rectHeight = this.currentY - this.startY;

    // Validation
    if (rectWidth <= 0 || rectHeight <= 0) {
      this.clearRectangles();
      this.toastService.showWarning("Please select area on image");
      return;
    }

    // Convert screen coordinates to image coordinates
    // 1. Remove pan offset
    // 2. Account for zoom
    // 3. Apply scale factor to get original image coordinates
    const imageStartX = ((this.startX - this.panX) / this.zoomLevel) * scaleX;
    const imageStartY = ((this.startY - this.panY) / this.zoomLevel) * scaleY;
    const imageRectWidth = (rectWidth / this.zoomLevel) * scaleX;
    const imageRectHeight = (rectHeight / this.zoomLevel) * scaleY;

    // Store coordinates
    const pageIndex = this.rectangles.findIndex((data) => data.page_number === this.currentImageIndex + 1);

    if (pageIndex === -1) {
      // If page_number does not exist, push new data
      this.rectangles.push({
        page_number: this.currentImageIndex + 1,
        regions: {
          [this.selectedField.key]: {
            // Store the actual image coordinates
            region: [
              Math.round(imageStartX),
              Math.round(imageStartY),
              Math.round(imageRectWidth),
              Math.round(imageRectHeight),
            ],
            // Store the screen coordinates for redrawing
            rectToDraw: [
              Math.round(this.startX),
              Math.round(this.startY),
              Math.round(rectWidth),
              Math.round(rectHeight),
            ],
            zoomLevel: this.zoomLevel,
            panX: this.panX,
            panY: this.panY,
            label: this.templateForm.value.fieldName,
            ignore: [],
          },
        },
      });
    } else {
      const page = this.rectangles[pageIndex];
      if (page.regions[this.selectedField.key]) {
        // Update existing region
        page.regions[this.selectedField.key].region = [
          Math.round(imageStartX),
          Math.round(imageStartY),
          Math.round(imageRectWidth),
          Math.round(imageRectHeight),
        ];
        page.regions[this.selectedField.key].rectToDraw = [
          Math.round(this.startX),
          Math.round(this.startY),
          Math.round(rectWidth),
          Math.round(rectHeight),
        ];
        page.regions[this.selectedField.key].zoomLevel = this.zoomLevel;
        page.regions[this.selectedField.key].panX = this.panX;
        page.regions[this.selectedField.key].panY = this.panY;
      } else {
        // Add new region
        page.regions[this.selectedField.key] = {
          region: [
            Math.round(imageStartX),
            Math.round(imageStartY),
            Math.round(imageRectWidth),
            Math.round(imageRectHeight),
          ],
          rectToDraw: [Math.round(this.startX), Math.round(this.startY), Math.round(rectWidth), Math.round(rectHeight)],
          label: this.templateForm.value.fieldName,
          ignore: [],
          zoomLevel: this.zoomLevel,
          panX: this.panX,
          panY: this.panY,
        };
      }
    }
    this.fillDataList();
  }

  fillDataList() {
    this.dataList = [];
    this.dataList = this.rectangles.reduce((acc: any[], page) => {
      Object.keys(page.regions).forEach((field) => {
        acc.push({
          pageNo: page.page_number,
          field: field,
          fieldLabel: page.regions[field].label,
        });
      });
      return acc;
    }, []);
    // Updating dataList by matching field and key
    this.dataList.forEach((dataItem) => {
      const matchedField = this.fields.find((field) => field.key === dataItem.field);
      if (matchedField) {
        dataItem.label = matchedField.value; // Adding matching key
      }
    });
    this.dataList.reverse();
  }

  clearRectangles(): void {
    if (this.images.length > 0) {
      // Redraw the original image to reset the canvas
      this.context.putImageData(this.originalImage, 0, 0);

      // Optionally, clear the rectangles array
      // this.rectangles = [];
    }
  }

  // Triggered when the mouse leaves the canvas
  onMouseLeave(event: MouseEvent): void {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.currentX = event.offsetX;
      this.currentY = event.offsetY;

      // Apply overlay and finalize the rectangle drawing
      this.drawRectangle();
    }
  }

  // Draw the rectangle outline only
  drawRectangle(): void {
    this.context.beginPath();
    const rectWidth = this.currentX - this.startX;
    const rectHeight = this.currentY - this.startY;
    this.context.strokeStyle = "#272727"; // Set stroke color (red)
    this.context.lineWidth = 1; // Set stroke width
    this.context.strokeRect(this.startX, this.startY, rectWidth, rectHeight); // Draw rectangle outline
  }

  applyOverlay(): void {
    const canvasElement = this.canvas.nativeElement;

    // First, fill the entire canvas with a semi-transparent black overlay
    this.context.fillStyle = "rgba(0, 0, 0, 0.5)"; // Dark overlay
    this.context.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // Calculate the adjusted coordinates and dimensions based on zoom and pan
    const adjustedStartX = (this.startX - this.panX) / this.zoomLevel;
    const adjustedStartY = (this.startY - this.panY) / this.zoomLevel;
    const adjustedCurrentX = (this.currentX - this.panX) / this.zoomLevel;
    const adjustedCurrentY = (this.currentY - this.panY) / this.zoomLevel;

    const rectWidth = adjustedCurrentX - adjustedStartX;
    const rectHeight = adjustedCurrentY - adjustedStartY;

    // Clear the area inside the rectangle to show the image underneath
    this.context.clearRect(this.startX, this.startY, this.currentX - this.startX, this.currentY - this.startY);

    // Redraw the image portion inside the rectangle
    this.context.drawImage(
      this.img,
      (adjustedStartX * this.img.width) / canvasElement.width,
      (adjustedStartY * this.img.height) / canvasElement.height,
      (rectWidth * this.img.width) / canvasElement.width,
      (rectHeight * this.img.height) / canvasElement.height,
      this.startX,
      this.startY,
      this.currentX - this.startX,
      this.currentY - this.startY
    );

    // Redraw the rectangle outline to make it visible
    this.context.strokeStyle = "#272727"; // Outline color
    this.context.lineWidth = 1; // Thickness of the outline
    this.context.strokeRect(this.startX, this.startY, this.currentX - this.startX, this.currentY - this.startY);
  }

  showAllSelections(): void {
    const currentPage = this.rectangles.find((page: any) => page.page_number === this.currentImageIndex + 1);

    if (currentPage && this.selectedField.key in currentPage.regions) {
      const canvasElement = this.canvas.nativeElement;
      const region = currentPage.regions[this.selectedField.key];
      const savedZoomLevel = region.zoomLevel;
      const savedPanX = region.panX;
      const savedPanY = region.panY;

      // If zoom and pan values exist, adjust the view
      if (savedZoomLevel !== undefined) {
        this.zoomLevel = savedZoomLevel;
        this.zoomCounter = Math.log(savedZoomLevel) / Math.log(1.1);
      }

      if (savedPanX !== undefined) {
        this.panX = savedPanX;
      }

      if (savedPanY !== undefined) {
        this.panY = savedPanY;
      }

      // Redraw the image with new zoom and pan
      this.drawImageOnCanvas();

      // Calculate current scale
      let newScale = Math.pow(+this.zoomLevel, this.zoomCounter);

      // Get the original coordinates from the saved region
      const originalX = region.rectToDraw[0];
      const originalY = region.rectToDraw[1];
      const originalWidth = region.rectToDraw[2];
      const originalHeight = region.rectToDraw[3];

      // Add semi-transparent overlay
      this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.context.fillRect(0, 0, canvasElement.width, canvasElement.height);

      // Clear the rectangle area
      this.context.clearRect(originalX, originalY, originalWidth, originalHeight);

      const scaleX = this.img.width / this.canvas.width;
      const scaleY = this.img.height / this.canvas.height;
      let x = Math.floor(region.region[0] / scaleX);
      let y = Math.floor(region.region[1] / scaleY);
      let width = Math.floor(region.region[2] / scaleX);
      let height = Math.floor(region.region[3] / scaleY);
      // Redraw the image portion inside the rectangle
      this.context.drawImage(this.img, x, y, width, height, originalX, originalY, originalWidth, originalHeight);

      // Draw rectangle outline
      this.context.strokeStyle = "#272727";
      this.context.lineWidth = 1;

      this.context.strokeRect(originalX, originalY, originalWidth, originalHeight);
    }
  }

  saveTemplate() {
    let alertDialogDetails: AlertDetails = {
      showWarningIcon: true,
      title: "Create Template",
      message: "Are you sure you want to create template?",
      showOkButton: true,
      okButtonLabel: "Create",
    };
    this.alertDialogService.openAlertDialog(alertDialogDetails);
    // Unsubscribe from any previous subscription
    if (this.resultSubscription) {
      this.resultSubscription.unsubscribe();
    }
    this.resultSubscription = this.alertDialogService.result$.subscribe((result: any) => {
      if (result) {
        let fieldsJson: any[] = [];
        for (let i = 0; i < this.dataList.length; i++) {
          fieldsJson.push({
            control: this.dataList[i].field,
            label: this.dataList[i].label,
          });
        }
        // Function to remove duplicates based on 'control' and 'label'
        const uiFieldsJson = fieldsJson.filter(
          (item, index, self) => index === self.findIndex((t) => t.control === item.control && t.label === item.label)
        );
        let providerId = this.templateForm.get("providerId").value;
        let propertyId = this.templateForm.get("propertyId").value;
        // this.archiveRecord(event);

        // Find the minimum page number in the current array
        const minPageNumber = Math.min(...this.rectangles.map((item) => item.page_number));

        // If the minimum page number is greater than 1, add objects with increasing page numbers
        if (minPageNumber > 1) {
          for (let i = 1; i < minPageNumber; i++) {
            this.rectangles.unshift({ page_number: i, regions: {} });
          }
        }

        this.imageEditorService
          .saveTemplate(
            this.rectangles,
            this.selectedUtility.id,
            this.templateForm.value.templateName,
            uiFieldsJson,
            providerId,
            propertyId
          )
          .subscribe((res: any) => {
            if (res.status.toLowerCase() == "success") {
              this.toastService.showSuccess(res.message, "Success");
              this.resetForm();
              window.location.reload();
            } else {
              this.toastService.showError(res.message, "Error");
            }
          });
      }
    });
  }

  resetForm() {
    this.templateForm.reset();
    this.clearRectangles();
    this.rectangles = [];
    this.selectedProperty = null;
    this.selectedProvider = null;
    this.selectedField = "";
    this.selectedTemplate = "";
    this.selectedUtility = "";
  }

  fileUploadVisible: boolean = true;
  fileChange(event: any) {
    if (event.target.files.length > 0) {
      this.images = [];
      this.startX = 0;
      this.startY = 0;
      this.currentX = 0;
      this.currentY = 0;
      this.currentImageIndex = 0;
      this.resetForm();
      this.dataList = [];
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

  onActionClick(event: any) {
    this.deleteFieldFromOriginalData(event.record);
  }

  deleteFieldFromOriginalData(deleteObj: any) {
    this.rectangles
      .map((page) => {
        // If the page matches the page number
        if (
          page.page_number === deleteObj.pageNo &&
          deleteObj.field in page.regions &&
          page.regions[deleteObj.field].label === deleteObj.fieldLabel
        ) {
          // Delete the specific field from regions if it exists
          if (page.regions[deleteObj.field]) {
            delete page.regions[deleteObj.field];
          }

          // Remove the page if regions is empty
          if (Object.keys(page.regions).length === 0) {
            const objectToRemove = this.rectangles.findIndex((obj) => obj.page_number === page.page_number);
            this.rectangles.splice(objectToRemove, 1);
            return null; // Indicating the page should be removed
          }
        }
        return page; // Return the page if no deletion occurred or it still has regions
      })
      .filter((page) => page !== null); // Filter out null entries
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.clearRectangles();
    this.loadImage();
    this.fillDataList();
  }

  zoomLevel: number = 1; // Default zoom level (1 means no zoom)
  zoomFactor: number = 0.1; // Zoom factor for each step (adjust as needed)
  zoomCounter: number = 0;
  panX: number = 0; // Initial horizontal pan position
  panY: number = 0; // Initial vertical pan position

  zoomIn(): void {
    if (this.zoomCounter < 5) {
      this.zoomCounter++;
      this.zoomLevel += this.zoomFactor;
      this.drawImageOnCanvas();
    }
  }

  zoomOut(): void {
    if (this.zoomCounter > 0) {
      this.zoomCounter--;
      if (this.zoomLevel > this.zoomFactor) {
        this.zoomLevel -= this.zoomFactor;
        this.drawImageOnCanvas();
      }
    }
  }

  onArrowKeyPress(event: KeyboardEvent): void {
    const panSpeed = 10; // Adjust the pan speed as needed
    const canvasElement = this.canvas;

    const canvasWidth = canvasElement.width;
    const canvasHeight = canvasElement.height;

    // Calculate scaled image dimensions
    const imageWidth = this.img.width * this.zoomLevel;
    const imageHeight = this.img.height * this.zoomLevel;

    const validArrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (validArrowKeys.includes(event.key)) {
      // Check if image is larger than canvas in either dimension
      if (imageWidth > canvasWidth || imageHeight > canvasHeight) {
        switch (event.key) {
          case "ArrowLeft":
            // Prevent panning past the left edge
            // Ensure panX doesn't go beyond 0 (left canvas edge)
            if (this.panX + panSpeed <= 0) {
              this.panX += panSpeed;
            }
            break;
          case "ArrowRight":
            // Prevent panning past the right edge
            // Ensure the right edge of the image doesn't go beyond canvas width
            if (this.panX - panSpeed >= canvasWidth - imageWidth) {
              this.panX -= panSpeed;
            }
            break;
          case "ArrowUp":
            // Prevent panning past the top edge
            // Ensure panY doesn't go beyond 0 (top canvas edge)
            if (this.panY + panSpeed <= 0) {
              this.panY += panSpeed;
            }
            break;
          case "ArrowDown":
            // Prevent panning past the bottom edge
            // Ensure the bottom edge of the image doesn't go beyond canvas height
            if (this.panY - panSpeed >= canvasHeight - imageHeight) {
              this.panY -= panSpeed;
            }
            break;
        }

        // Redraw the image after pan adjustment
        this.drawImageOnCanvas();
      }
    }
  }
}

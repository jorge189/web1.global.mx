import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialogo-forward-pass',
  templateUrl: './dialogo-forward-pass.component.html',
  styleUrls: ['./dialogo-forward-pass.component.css']
})
export class DialogoForwardPassComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DialogoForwardPassComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,private _snackBar: MatSnackBar) {}

  onNoClick(): void {
    this.dialogRef.close({mail: this.data.correo});
    
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'cerrar', {
      duration: 3000,
    });
  }
  ngOnInit() {
  }

}





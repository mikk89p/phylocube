export class CubeLimits{
  
  constructor(
    private _xLowerLimit: number,
    private _xUpperLimit: number,
    private _yLowerLimit: number,
    private _yUpperLimit: number,
    private _zLowerLimit: number,
    private _zUpperLimit: number,
    private _vLowerLimit?: number,
    private _vUpperLimit?: number ){}

    get xLowerLimit (){
      return this._xLowerLimit;
    }
    set xLowerLimit (value){
      this._xLowerLimit=value;
    }
    get xUpperLimit (){
      return this._xUpperLimit;
    }
    set xUpperLimit (value){
      this._xUpperLimit=value;
    }

    get yLowerLimit (){
      return this._yLowerLimit;
    }
    set yLowerLimit (value){
      this._yLowerLimit=value;
    }
    get yUpperLimit (){
      return this._yUpperLimit;
    }
    set yUpperLimit (value){
      this._yUpperLimit=value;
    }

    get zLowerLimit (){
      return this._zLowerLimit;
    }
    set zLowerLimit (value){
      this._zLowerLimit=value;
    }
    get zUpperLimit (){
      return this._zUpperLimit;
    }
    set zUpperLimit (value){
      this._zUpperLimit=value;
    }

    get vLowerLimit (){
      return this._vLowerLimit;
    }
    set vLowerLimit (value){
      this._vLowerLimit=value;
    }
    get vUpperLimit (){
      return this._vUpperLimit;
    }
    set vUpperLimit (value){
      this._vUpperLimit=value;
    }

}
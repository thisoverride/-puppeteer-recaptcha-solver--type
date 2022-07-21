import axios from "axios";
import https from "https";

/**
 *
 *
 * @export
 * @class Solver
 */

export class Solver {
  private iframe: any;
  private frame: any;
  private readonly URL: string = "https://api.wit.ai/speech?v=2021092";

  public async solve(page: any): Promise<void> {
    try {
      this.getIframe(page);
      this.frame = await page.frames()
      const recaptchaFrame = this.frame.find((frame: { url: () => string | string[]; }) => frame.url().includes('api2/anchor'))
      const checkbox = await recaptchaFrame.$('#recaptcha-anchor')
        await checkbox.click({ delay: this.rendDelay(30, 150) })
        this.getrecaptchaImage(page)

    } catch (e) {}
  }
/**
 *
 *
 * @private
 * @param {*} page
 * @return {*}  {Promise<any>}
 * @memberof Solver
 */
private async getIframe(page: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await page.waitForFunction(() => {
          this.iframe = document.querySelector('iframe[src*="api2/anchor"]');
          if (!this.iframe) return false;
          
          resolve(!!this.iframe.contentWindow.document.querySelector("#recaptcha-anchor"));
        });
      } catch(e) {
        reject(e);
      }
    });
  }

  private async getrecaptchaImage(page:any):Promise <void>{
    return new Promise(async (resolve,reject)=>{
        await page.waitForFunction(() => {
            this.iframe = document.querySelector('iframe[src*="api2/bframe"]')
            if (!this.iframe) return false
      
            const img = this.iframe.contentWindow.document.querySelector('.rc-image-tile-wrapper img')
            return img && img.complete
          })
    })
  }

  /**
   *
   *
   * @private
   * @param {number} min
   * @param {number} max
   * @return {*}  {number}
   * @memberof Solver
   */

  private rendDelay(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

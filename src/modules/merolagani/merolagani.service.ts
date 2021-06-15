import { Injectable } from "@nestjs/common";
import { launch } from "puppeteer";
import {EOL} from 'os'


@Injectable()
export class MerolaganiService {
    public constructor(
    ) { }

    public async find(symbol:string) {
        const browser = await launch();
        const page = await browser.newPage();
        const url = 'https://merolagani.com/CompanyDetail.aspx?symbol='+symbol
        await page.goto(url);

        const [result] = await page.evaluate(() => {
            const tableFromWeb = document.querySelectorAll("#accordion")
            const tableData = [...tableFromWeb]
            return tableData.map(res=> (res as HTMLElement).innerText)
        })
      
      const rows = result.split(EOL)
      const columns = rows.map(row=>{
         return row.split("\t")
      })
      
        browser.close();
        return columns
    }
}
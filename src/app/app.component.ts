import { timeout, catchError, concatMap, distinctUntilChanged, debounceTime, switchMap, exhaustMap, mergeMap, delay } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit, NgModule } from '@angular/core';
import { of, concat, fromEvent, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit{
  // Simulated API call (takes 2 seconds to respond)
  fakeApiCall= (id:number) => of(`Response from API: ${id}`).pipe(delay(2000));
  clicks$!: Observable<Event>;

  ngOnInit(): void {
    this.fakeApiCall = (id:number) => of(`Response from API: ${id}`).pipe(delay(2000));
    const button = document.querySelector('button');
    if (button) {
      this.clicks$ = fromEvent(button, 'click');
    }
  }

  ngAfterViewInit(): void {
    this.mergeMap();
    this.concatMap();
    this.switchMap();
    this.exhaustMap();
  }
  
  mergeMap() {

    this.clicks$.pipe(
      mergeMap((_, index) => this.fakeApiCall(index), 2) // Limit to 2 concurrent subscriptions
    ).subscribe((response: any) => console.log('mergeMap with concurrency limit:', response));

  }

  concatMap() {

    this.clicks$.pipe(
      concatMap((_, index) =>
        this.fakeApiCall(index).pipe(
          timeout(5000), // Cancel if response takes more than 5 seconds
          catchError(err => of(`Timeout for request ${index}`)) // Handle timeout gracefully
        )
      )
    ).subscribe((response: any) => console.log('concatMap with timeout:', response));

  }

  switchMap() {

    this.clicks$.pipe(
      debounceTime(300), // Wait for 300ms of inactivity before switching
      distinctUntilChanged(), // Ignore duplicate values
      switchMap((_, index) => this.fakeApiCall(index))
    ).subscribe((response: any) => console.log('switchMap with debounce:', response));

  }
  exhaustMap() {

    this.clicks$.pipe(
      exhaustMap((_, index) => 
        concat(
          this.fakeApiCall(index), // Current observable
          of(`Missed emission ${index + 1}`) // Handle skipped emissions
        )
      )
    ).subscribe((response: any) => console.log('exhaustMap with fallback:', response));

  }
}

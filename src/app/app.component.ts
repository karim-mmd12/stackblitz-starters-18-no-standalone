
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    // Basic Subject
    this.basicSubject();
    
    // Behavior Subject
    this.behaviorSubject();

    //Replay Subject
    this.replaySubject();

    //Async Subject
    this.asyncSubject();
    
  }
  basicSubject() {
    console.log("Basic Subject");
    // Create a Subject
    const subject = new Subject();

    //values won't emit because they are before subscribe
    /* subject.next('Hello1');
    subject.next('World1'); */

    // Subscribe to the Subject
    subject.subscribe(value => console.log('Subscriber 1:', value));
    subject.subscribe(value => console.log('Subscriber 2:', value));

    // Emit values
    subject.next('Hello');
    subject.next('World');

  }
  behaviorSubject() {
    console.log("Behavior Subject");

    // Create a BehaviorSubject with an initial value
    const behaviorSubject = new BehaviorSubject('Initial');

    // Emit new values
    // will replace the initial value
    // behaviorSubject.next('Initial1');

    // Subscribe to the BehaviorSubject
    behaviorSubject.subscribe(value => console.log('Subscriber 1:', value));

    // Emit new values
    behaviorSubject.next('Updated');

    // Subscribe again (new subscribers get the latest value)
    behaviorSubject.subscribe(value => console.log('Subscriber 2:', value));

  }
  replaySubject() {
    console.log("Replay Subject");

    // Create a ReplaySubject to replay the last 2 values
    const replaySubject = new ReplaySubject(2);
    
    // Emit some values
    replaySubject.next('Value 1');
    replaySubject.next('Value 2');
    replaySubject.next('Value 3');
    
    // Subscribe to the ReplaySubject
    replaySubject.subscribe(value => console.log('Subscriber:', value));
    
    replaySubject.next('Value 4');
    replaySubject.next('Value 5');

  }

  asyncSubject() {
    console.log("AsyncSubject");
    // Create an AsyncSubject
    const asyncSubject = new AsyncSubject();

    // Subscribe to the AsyncSubject
    asyncSubject.subscribe(value => console.log('Subscriber1:', value));

    // Emit values
    asyncSubject.next('Value 1');
    asyncSubject.next('Value 2');

    
    // Subscribe to the AsyncSubject
    asyncSubject.subscribe(value => console.log('Subscriber2:', value));
    
    // Emit values
    asyncSubject.next('Value 3');
    // Complete the AsyncSubject (triggers the emission of the last value)
    asyncSubject.complete();
    asyncSubject.next('Value 4');

     // Complete the AsyncSubject (triggers the emission of the last value)
     asyncSubject.complete();

  }

  
  
}

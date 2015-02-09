<h1 class="styleguide--header">Forms</h1>


<form class="form__horizontal">
  <fieldset>
    <legend>Legend</legend>
    <div class="form__group">
      <label for="inputEmail" class="control--label">Email</label>
      <input type="text" class="form--control" id="inputEmail" placeholder="Email">
    </div>
    <div class="form__group">
      <label for="inputName" class="control--label">Name</label>
      <input type="name" class="form--control" id="inputName" placeholder="Name">
      <div class="checkbox">
        <label>
          <input type="checkbox"> Checkbox
        </label>
      </div>
    </div>
    <div class="form__group">
      <label for="textArea" class="control--label">Textarea</label>
      <textarea class="form--control" rows="3" id="textArea"></textarea>
      <span class="help--block">A longer block of help text that breaks onto a new line and may extend beyond one line.</span>
    </div>
    <div class="form__group">
      <label class="control--label">Radios</label>
      <div class="radio">
        <label>
          <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked="">
          Option one is this
        </label>
      </div>
      <div class="radio">
        <label>
          <input type="radio" name="optionsRadios" id="optionsRadios2" value="option2">
          Option two can be something else
        </label>
      </div>
    </div>
    <div class="form__group">
      <label for="select" class="control--label">Selects</label>
        <select class="form--control" id="select">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
        <br>
        <select multiple="" class="form--control">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
    </div>
    <div class="form__group">
      <button class="btn btn--gamma">Cancel</button> 
      <button type="submit" class="btn">Submit</button> 
    </div>
  </fieldset>
</form>


<form class="">
  <div class="form__group">
    <label class="control--label" for="focusedInput">Focused input</label>
    <input class="form--control" id="focusedInput" type="text" value="This is focused...">
  </div>
  <div class="form__group">
    <label class="control--label" for="disabledInput">Disabled input</label>
    <input class="form--control" id="disabledInput" type="text" placeholder="Disabled input here..." disabled="">
  </div>
  <div class="form__group has--error">
    <label class="control--label" for="inputError">Input error</label>
    <input type="text" class="form--control" id="inputError">
  </div>
  <div class="form__group">
    <label class="control--label" for="inputLarge">Large input</label>
    <input class="form--control input-lg" type="text" id="inputLarge">
  </div>
  <div class="form__group">
    <label class="control--label" for="inputSmall">Small input</label>
    <input class="form--control input-sm" type="text" id="inputSmall">
  </div>
</form>